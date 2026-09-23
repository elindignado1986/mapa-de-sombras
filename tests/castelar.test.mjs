import test from 'node:test';
import assert from 'node:assert/strict';
import {build} from 'esbuild';
import fs from 'node:fs';
import {pathToFileURL} from 'node:url';
await build({stdin:{contents:"export {PhotonProvider} from './src/geocoder.js';export {contains} from './src/geometry.js';",resolveDir:process.cwd()},bundle:true,platform:'node',format:'esm',outfile:'.checks/castelar-tests.mjs'});
const {PhotonProvider,contains}=await import(pathToFileURL(process.cwd()+'/.checks/castelar-tests.mjs'));
const boundary=JSON.parse(fs.readFileSync('data/context/castelar-boundary.json')).geometry;
test('Castelar includes north and south, excludes central Moron and filters geocoding by boundary',async()=>{const north=[-58.65,-34.64],south=[-58.65,-34.68],outside=[-58.619,-34.650];assert(contains(boundary,north));assert(contains(boundary,south));assert(!contains(boundary,outside));const original=globalThis.fetch;globalThis.fetch=async()=>({ok:true,json:async()=>({features:[north,south,outside].map(coordinates=>({geometry:{type:'Point',coordinates},properties:{countrycode:'AR',county:'Partido de Morón',street:'Prueba',housenumber:'123'}}))})});try{const results=await new PhotonProvider().search('Prueba 123','castelar');assert.equal(results.length,2);assert(results.every(r=>contains(boundary,r.point)));}finally{globalThis.fetch=original;}});
