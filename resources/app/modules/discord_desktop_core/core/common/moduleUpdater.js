"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.initPathsOnly=initPathsOnly,exports.init=init,exports.checkForUpdates=checkForUpdates,exports.setInBackground=setInBackground,exports.quitAndInstallUpdates=quitAndInstallUpdates,exports.isInstalled=isInstalled,exports.getInstalled=getInstalled,exports.install=install,exports.installPendingUpdates=installPendingUpdates,exports.supportsEventObjects=exports.events=exports.NO_PENDING_UPDATES=exports.INSTALLING_MODULE_PROGRESS=exports.INSTALLING_MODULE=exports.INSTALLING_MODULES_FINISHED=exports.DOWNLOADED_MODULE=exports.UPDATE_MANUALLY=exports.DOWNLOADING_MODULES_FINISHED=exports.DOWNLOADING_MODULE_PROGRESS=exports.DOWNLOADING_MODULE=exports.UPDATE_CHECK_FINISHED=exports.INSTALLED_MODULE=exports.CHECKING_FOR_UPDATES=void 0;var _fs=_interopRequireDefault(require("fs")),_path=_interopRequireDefault(require("path")),_module=_interopRequireDefault(require("module")),_events=require("events"),_mkdirp=_interopRequireDefault(require("mkdirp")),_process=require("process"),_yauzl=_interopRequireDefault(require("yauzl")),_Backoff=_interopRequireDefault(require("./Backoff")),paths=_interopRequireWildcard(require("./paths"));function _getRequireWildcardCache(){if("function"!=typeof WeakMap)return null;var e=new WeakMap;return _getRequireWildcardCache=function(){return e},e}function _interopRequireWildcard(e){if(e&&e.__esModule)return e;if(null===e||"object"!=typeof e&&"function"!=typeof e)return{default:e};var t=_getRequireWildcardCache();if(t&&t.has(e))return t.get(e);var o={},n=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var l in e)if(Object.prototype.hasOwnProperty.call(e,l)){var a=n?Object.getOwnPropertyDescriptor(e,l):null;a&&(a.get||a.set)?Object.defineProperty(o,l,a):o[l]=e[l]}return o.default=e,t&&t.set(e,o),o}function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}const originalFs=require("original-fs"),CHECKING_FOR_UPDATES="checking-for-updates";exports.CHECKING_FOR_UPDATES=CHECKING_FOR_UPDATES;const INSTALLED_MODULE="installed-module";exports.INSTALLED_MODULE=INSTALLED_MODULE;const UPDATE_CHECK_FINISHED="update-check-finished";exports.UPDATE_CHECK_FINISHED=UPDATE_CHECK_FINISHED;const DOWNLOADING_MODULE="downloading-module";exports.DOWNLOADING_MODULE=DOWNLOADING_MODULE;const DOWNLOADING_MODULE_PROGRESS="downloading-module-progress";exports.DOWNLOADING_MODULE_PROGRESS=DOWNLOADING_MODULE_PROGRESS;const DOWNLOADING_MODULES_FINISHED="downloading-modules-finished";exports.DOWNLOADING_MODULES_FINISHED=DOWNLOADING_MODULES_FINISHED;const UPDATE_MANUALLY="update-manually";exports.UPDATE_MANUALLY=UPDATE_MANUALLY;const DOWNLOADED_MODULE="downloaded-module";exports.DOWNLOADED_MODULE=DOWNLOADED_MODULE;const INSTALLING_MODULES_FINISHED="installing-modules-finished";exports.INSTALLING_MODULES_FINISHED=INSTALLING_MODULES_FINISHED;const INSTALLING_MODULE="installing-module";exports.INSTALLING_MODULE=INSTALLING_MODULE;const INSTALLING_MODULE_PROGRESS="installing-module-progress";exports.INSTALLING_MODULE_PROGRESS=INSTALLING_MODULE_PROGRESS;const NO_PENDING_UPDATES="no-pending-updates";exports.NO_PENDING_UPDATES=NO_PENDING_UPDATES;const ALWAYS_ALLOW_UPDATES="ALWAYS_ALLOW_UPDATES",SKIP_HOST_UPDATE="SKIP_HOST_UPDATE",SKIP_MODULE_UPDATE="SKIP_MODULE_UPDATE",ALWAYS_BOOTSTRAP_MODULES="ALWAYS_BOOTSTRAP_MODULES",USE_LOCAL_MODULE_VERSIONS="USE_LOCAL_MODULE_VERSIONS";class Events extends _events.EventEmitter{constructor(){super(),this.history=[]}append(e){e.now=String(_process.hrtime.bigint()),this._eventIsInteresting(e)&&this.history.push(e),process.nextTick(()=>this.emit(e.type,e))}_eventIsInteresting(e){return e.type!==DOWNLOADING_MODULE_PROGRESS&&e.type!==INSTALLING_MODULE_PROGRESS}}class LogStream{constructor(e){try{this.logStream=_fs.default.createWriteStream(e,{flags:"a"})}catch(t){console.error(`Failed to create ${e}: ${String(t)}`)}}log(e){e="[Modules] "+e,console.log(e),this.logStream&&(this.logStream.write(e),this.logStream.write("\r\n"))}end(){this.logStream&&(this.logStream.end(),this.logStream=null)}}const request=require("../app_bootstrap/request"),REQUEST_TIMEOUT=15e3,backoff=new _Backoff.default(1e3,2e4),events=new Events;exports.events=events;const supportsEventObjects=!0;let logger,locallyInstalledModules,moduleInstallPath,installedModulesFilePath,moduleDownloadPath,bootstrapping,hostUpdater,hostUpdateAvailable,skipHostUpdate,skipModuleUpdate,checkingForUpdates,remoteBaseURL,remoteQuery,settings,remoteModuleVersions,installedModules,download,unzip,newInstallInProgress,localModuleVersionsFilePath,updatable,bootstrapManifestFilePath;exports.supportsEventObjects=!0;let runningInBackground=!1;function initPathsOnly(e){locallyInstalledModules||moduleInstallPath||(locallyInstalledModules=null!=e.localModulesRoot,locallyInstalledModules?-1===_module.default.globalPaths.indexOf(e.localModulesRoot)&&_module.default.globalPaths.push(e.localModulesRoot):(moduleInstallPath=_path.default.join(paths.getUserDataVersioned(),"modules"),-1===_module.default.globalPaths.indexOf(moduleInstallPath)&&_module.default.globalPaths.push(moduleInstallPath)))}function init(e,t,o){const n=e;settings=t;const l=o;if(updatable="0.0.0"!=l.version&&!l.debug||settings.get(ALWAYS_ALLOW_UPDATES),initPathsOnly(l),logger=new LogStream(_path.default.join(paths.getUserData(),"modules.log")),bootstrapping=!1,hostUpdateAvailable=!1,checkingForUpdates=!1,skipHostUpdate=settings.get(SKIP_HOST_UPDATE)||!updatable,skipModuleUpdate=settings.get(SKIP_MODULE_UPDATE)||locallyInstalledModules||!updatable,localModuleVersionsFilePath=_path.default.join(paths.getUserData(),"local_module_versions.json"),bootstrapManifestFilePath=_path.default.join(paths.getResources(),"bootstrap","manifest.json"),installedModules={},remoteModuleVersions={},newInstallInProgress={},download={active:!1,queue:[],next:0,failures:0},unzip={active:!1,queue:[],next:0,failures:0},logger.log("Modules initializing"),logger.log("Distribution: "+(locallyInstalledModules?"local":"remote")),logger.log("Host updates: "+(skipHostUpdate?"disabled":"enabled")),logger.log("Module updates: "+(skipModuleUpdate?"disabled":"enabled")),!locallyInstalledModules){installedModulesFilePath=_path.default.join(moduleInstallPath,"installed.json"),moduleDownloadPath=_path.default.join(moduleInstallPath,"pending"),_mkdirp.default.sync(moduleDownloadPath),logger.log("Module install path: "+moduleInstallPath),logger.log("Module installed file path: "+installedModulesFilePath),logger.log("Module download path: "+moduleDownloadPath);let e=!1;try{installedModules=JSON.parse(_fs.default.readFileSync(installedModulesFilePath))}catch(t){e=!0}cleanDownloadedModules(installedModules),bootstrapping=e||settings.get(ALWAYS_BOOTSTRAP_MODULES)}hostUpdater=require("../app_bootstrap/hostUpdater"),hostUpdater.on("checking-for-update",()=>events.append({type:CHECKING_FOR_UPDATES})),hostUpdater.on("update-available",()=>hostOnUpdateAvailable()),hostUpdater.on("update-progress",e=>hostOnUpdateProgress(e)),hostUpdater.on("update-not-available",()=>hostOnUpdateNotAvailable()),hostUpdater.on("update-manually",e=>hostOnUpdateManually(e)),hostUpdater.on("update-downloaded",()=>hostOnUpdateDownloaded()),hostUpdater.on("error",e=>hostOnError(e));const a=hostUpdater.setFeedURL.bind(hostUpdater);switch(remoteBaseURL=`${n}/modules/${l.releaseChannel}`,remoteQuery={host_version:l.version},process.platform){case"darwin":a(`${n}/updates/${l.releaseChannel}?platform=osx&version=${l.version}`),remoteQuery.platform="osx";break;case"win32":a(`${n}/updates/${l.releaseChannel}`),remoteQuery.platform="win";break;case"linux":a(`${n}/updates/${l.releaseChannel}?platform=linux&version=${l.version}`),remoteQuery.platform="linux"}}function cleanDownloadedModules(e){try{(_fs.default.readdirSync(moduleDownloadPath)||[]).forEach(t=>{const o=_path.default.join(moduleDownloadPath,t);let n=!0;for(const t of Object.keys(e))if(o===e[t].updateZipfile){n=!1;break}n&&_fs.default.unlinkSync(_path.default.join(moduleDownloadPath,t))})}catch(e){logger.log("Could not clean downloaded modules"),logger.log(e.stack)}}function hostOnUpdateAvailable(){logger.log("Host update is available."),hostUpdateAvailable=!0,events.append({type:UPDATE_CHECK_FINISHED,succeeded:!0,updateCount:1,manualRequired:!1}),events.append({type:DOWNLOADING_MODULE,name:"host",current:1,total:1,foreground:!runningInBackground})}function hostOnUpdateProgress(e){logger.log(`Host update progress: ${e}%`),events.append({type:DOWNLOADING_MODULE_PROGRESS,name:"host",progress:e})}function hostOnUpdateNotAvailable(){logger.log("Host is up to date."),skipModuleUpdate?events.append({type:UPDATE_CHECK_FINISHED,succeeded:!0,updateCount:0,manualRequired:!1}):checkForModuleUpdates()}function hostOnUpdateManually(e){logger.log("Host update is available. Manual update required!"),hostUpdateAvailable=!0,checkingForUpdates=!1,events.append({type:UPDATE_MANUALLY,newVersion:e}),events.append({type:UPDATE_CHECK_FINISHED,succeeded:!0,updateCount:1,manualRequired:!0})}function hostOnUpdateDownloaded(){logger.log("Host update downloaded."),checkingForUpdates=!1,events.append({type:DOWNLOADED_MODULE,name:"host",current:1,total:1,succeeded:!0}),events.append({type:DOWNLOADING_MODULES_FINISHED,succeeded:1,failed:0})}function hostOnError(e){logger.log("Host update failed: "+e),e&&-1!==String(e).indexOf("Could not get code signature for running application")&&(console.warn("Skipping host updates due to code signing failure."),skipHostUpdate=!0),checkingForUpdates=!1,hostUpdateAvailable?(events.append({type:DOWNLOADED_MODULE,name:"host",current:1,total:1,succeeded:!1}),events.append({type:DOWNLOADING_MODULES_FINISHED,succeeded:0,failed:1})):events.append({type:UPDATE_CHECK_FINISHED,succeeded:!1,updateCount:0,manualRequired:!1})}function checkForUpdates(){checkingForUpdates||(checkingForUpdates=!0,hostUpdateAvailable=!1,skipHostUpdate?(events.append({type:CHECKING_FOR_UPDATES}),hostOnUpdateNotAvailable()):(logger.log("Checking for host updates."),hostUpdater.checkForUpdates()))}function setInBackground(){runningInBackground=!0}function getRemoteModuleName(e){return"win32"===process.platform&&"x64"===process.arch?e+".x64":e}async function checkForModuleUpdates(){const e={...remoteQuery,_:Math.floor(Date.now()/1e3/60/5)},t=remoteBaseURL+"/versions.json";let o;logger.log("Checking for module updates at "+t);try{o=await request.get({url:t,qs:e,timeout:15e3}),checkingForUpdates=!1}catch(e){return checkingForUpdates=!1,logger.log("Failed fetching module versions: "+String(e)),void events.append({type:UPDATE_CHECK_FINISHED,succeeded:!1,updateCount:0,manualRequired:!1})}if(remoteModuleVersions=JSON.parse(o.body),settings.get(USE_LOCAL_MODULE_VERSIONS))try{remoteModuleVersions=JSON.parse(_fs.default.readFileSync(localModuleVersionsFilePath)),console.log("Using local module versions: ",remoteModuleVersions)}catch(e){console.warn("Failed to parse local module versions: ",e)}const n=[];for(const e of Object.keys(installedModules)){const t=installedModules[e],o=t.installedVersion;if(null===o)continue;const l=t.updateVersion||0,a=remoteModuleVersions[getRemoteModuleName(e)]||0;o!==a&&l!==a&&(logger.log(`Module update available: ${e}@${a} [installed: ${o}]`),n.push({name:e,version:a}))}events.append({type:UPDATE_CHECK_FINISHED,succeeded:!0,updateCount:n.length,manualRequired:!1}),0===n.length?logger.log("No module updates available."):n.forEach(e=>addModuleToDownloadQueue(e.name,e.version))}function addModuleToDownloadQueue(e,t,o){download.queue.push({name:e,version:t,authToken:o}),process.nextTick(()=>processDownloadQueue())}async function processDownloadQueue(){if(download.active)return;if(0===download.queue.length)return;download.active=!0;const e=download.queue[download.next];download.next+=1,events.append({type:DOWNLOADING_MODULE,name:e.name,current:download.next,total:download.queue.length,foreground:!runningInBackground});let t=0,o=0;const n=`${remoteBaseURL}/${encodeURIComponent(getRemoteModuleName(e.name))}/${encodeURIComponent(e.version)}`;logger.log(`Fetching ${e.name}@${e.version} from ${n}`);const l={};e.authToken&&(l.Authorization=e.authToken);const a=_path.default.join(moduleDownloadPath,`${e.name}-${e.version}.zip`),s=_fs.default.createWriteStream(a);s.on("progress",({receivedBytes:n,totalBytes:l})=>{o=n;const s=Math.min(Math.floor(o/l*100),100);t!==s&&(t=s,logger.log(`Streaming ${e.name}@${e.version} to ${a}: ${t}%`),events.append({type:DOWNLOADING_MODULE_PROGRESS,name:e.name,progress:t}))}),logger.log(`Streaming ${e.name}@${e.version} to ${a}`);try{const t=await request.get({url:n,qs:remoteQuery,headers:l,timeout:15e3,stream:s});finishModuleDownload(e.name,e.version,a,o,200===t.statusCode)}catch(t){logger.log(`Failed fetching module ${e.name}@${e.version}: ${String(t)}`),finishModuleDownload(e.name,e.version,null,o,!1)}}function commitInstalledModules(){const e=JSON.stringify(installedModules,null,2);_fs.default.writeFileSync(installedModulesFilePath,e)}function finishModuleDownload(e,t,o,n,l){if(installedModules[e]||(installedModules[e]={}),l?(installedModules[e].updateVersion=t,installedModules[e].updateZipfile=o,commitInstalledModules()):download.failures+=1,events.append({type:DOWNLOADED_MODULE,name:e,current:download.next,total:download.queue.length,succeeded:l,receivedBytes:n}),download.next>=download.queue.length){const e=download.queue.length-download.failures;logger.log(`Finished module downloads. [success: ${e}] [failure: ${download.failures}]`),events.append({type:DOWNLOADING_MODULES_FINISHED,succeeded:e,failed:download.failures}),download.queue=[],download.next=0,download.failures=0,download.active=!1}else{const e=()=>{download.active=!1,processDownloadQueue()};l?(backoff.succeed(),process.nextTick(e)):(logger.log(`Waiting ${Math.floor(backoff.current)}ms before next download.`),backoff.fail(e))}newInstallInProgress[e]&&addModuleToUnzipQueue(e,t,o)}function addModuleToUnzipQueue(e,t,o){unzip.queue.push({name:e,version:t,zipfile:o}),process.nextTick(()=>processUnzipQueue())}function processUnzipQueue(){if(unzip.active)return;if(0===unzip.queue.length)return;unzip.active=!0;const e=unzip.queue[unzip.next],t=installedModules[e.name],o=null!=t?t.installedVersion:null;unzip.next+=1,events.append({type:INSTALLING_MODULE,name:e.name,current:unzip.next,total:unzip.queue.length,foreground:!runningInBackground,oldVersion:o,newVersion:e.version});let n=!1;const l=(t,o)=>{n||(n=!0,logger.log(`Failed installing ${e.name}@${e.version}: ${String(t)}`),a=!1,o&&o.close(),finishModuleUnzip(e,a))};let a=!0;const s=_path.default.join(moduleInstallPath,e.name);logger.log(`Installing ${e.name}@${e.version} from ${e.zipfile}`);const d=(t,o)=>{if(t)return void l(t,null);const n=o.entryCount;let d=0;o.on("entry",t=>{d+=1;const a=Math.min(Math.floor(d/n*100),100);events.append({type:INSTALLING_MODULE_PROGRESS,name:e.name,progress:a}),/\/$/.test(t.fileName)?o.readEntry():o.openReadStream(t,(e,n)=>{e?l(e,o):(n.on("error",e=>l(e,o)),(0,_mkdirp.default)(_path.default.join(s,_path.default.dirname(t.fileName)),e=>{if(e)return void l(e,o);const a=_path.default.join(s,t.fileName+".tmp"),d=_path.default.join(s,t.fileName),r=originalFs.createWriteStream(a);r.on("error",e=>{n.destroy();try{originalFs.unlinkSync(a)}catch(e){}l(e,o)}),r.on("finish",()=>{try{originalFs.unlinkSync(d)}catch(e){}try{originalFs.renameSync(a,d)}catch(e){return void l(e,o)}o.readEntry()}),n.pipe(r)}))})}),o.on("error",e=>{l(e,o)}),o.on("end",()=>{a&&(installedModules[e.name].installedVersion=e.version,finishModuleUnzip(e,a))}),o.readEntry()};try{_yauzl.default.open(e.zipfile,{lazyEntries:!0,autoClose:!0},d)}catch(e){l(e,null)}}function finishModuleUnzip(e,t){if(delete newInstallInProgress[e.name],delete installedModules[e.name].updateZipfile,delete installedModules[e.name].updateVersion,commitInstalledModules(),t||(unzip.failures+=1),events.append({type:INSTALLED_MODULE,name:e.name,current:unzip.next,total:unzip.queue.length,succeeded:t}),unzip.next>=unzip.queue.length){const e=unzip.queue.length-unzip.failures;return bootstrapping=!1,logger.log(`Finished module installations. [success: ${e}] [failure: ${unzip.failures}]`),unzip.queue=[],unzip.next=0,unzip.failures=0,unzip.active=!1,void events.append({type:INSTALLING_MODULES_FINISHED,succeeded:e,failed:unzip.failures})}process.nextTick(()=>{unzip.active=!1,processUnzipQueue()})}function quitAndInstallUpdates(){logger.log(`Relaunching to install ${hostUpdateAvailable?"host":"module"} updates...`),hostUpdateAvailable?hostUpdater.quitAndInstall():relaunch()}function relaunch(){logger.end();const{app:e}=require("electron");e.relaunch(),e.quit()}function isInstalled(e,t){const o=installedModules[e];if(locallyInstalledModules)return!0;if(o&&o.installedVersion>0){if(!t)return!0;if(o.installedVersion===t)return!0}return!1}function getInstalled(){return{...installedModules}}function install(e,t,o){let{version:n,authToken:l}=o||{};if(isInstalled(e,n))t||events.append({type:INSTALLED_MODULE,name:e,current:1,total:1,succeeded:!0});else if(!newInstallInProgress[e])if(updatable)if(t){if(n)throw new Error(`Cannot defer install for a specific version module (${e}, ${n})`);logger.log(`Deferred install for ${e}...`),installedModules[e]={installedVersion:0},commitInstalledModules()}else logger.log(`Starting to install ${e}...`),n||(n=remoteModuleVersions[e]||0),newInstallInProgress[e]=n,addModuleToDownloadQueue(e,n,l);else logger.log(`Not updatable; ignoring request to install ${e}...`)}function installPendingUpdates(){const e=[];if(bootstrapping){let t={};try{t=JSON.parse(_fs.default.readFileSync(bootstrapManifestFilePath))}catch(e){}for(const o of Object.keys(t)){installedModules[o]={installedVersion:0};const n=_path.default.join(paths.getResources(),"bootstrap",o+".zip");e.push({moduleName:o,update:t[o],zipfile:n})}}for(const t of Object.keys(installedModules)){const o=installedModules[t].updateVersion||0,n=installedModules[t].updateZipfile;o>0&&null!=n&&e.push({moduleName:t,update:o,zipfile:n})}e.length>0?(logger.log((bootstrapping?"Bootstrapping":"Installing updates")+"..."),e.forEach(e=>addModuleToUnzipQueue(e.moduleName,e.update,e.zipfile))):(logger.log("No updates to install"),events.append({type:NO_PENDING_UPDATES}))}