import {spawnSync} from 'node:child_process';
for(const id of process.argv.slice(2)){const r=spawnSync(process.execPath,['scripts/process-parcels.mjs',id],{stdio:'inherit'});if(r.status)process.exit(r.status);}
const r=spawnSync(process.execPath,['scripts/validate-parcels.mjs'],{stdio:'inherit'});process.exitCode=r.status;
