import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),handler=require('../api/community.js');
const response=()=>({code:200,headers:{},setHeader(k,v){this.headers[k]=v},status(code){this.code=code;return this},json(body){this.body=body;return this}});
test('community disabled without credentials; app requires no backend',async()=>{delete process.env.COMMUNITY_REDIS_URL;delete process.env.COMMUNITY_REDIS_TOKEN;const res=response();await handler({method:'GET'},res);assert.equal(res.code,200);assert.equal(res.body.enabled,false);});
test('community rejects geometry and untrusted origins before storage calls',async()=>{process.env.COMMUNITY_REDIS_URL='https://example.invalid';process.env.COMMUNITY_REDIS_TOKEN='test';process.env.COMMUNITY_ORIGIN='https://example.test';let res=response();await handler({method:'POST',headers:{origin:'https://example.test'},body:{event:'simulation_created',geometry:{}}},res);assert.equal(res.code,400);res=response();await handler({method:'POST',headers:{origin:'https://evil.test'},body:{event:'simulation_created'}},res);assert.equal(res.code,403);delete process.env.COMMUNITY_REDIS_URL;delete process.env.COMMUNITY_REDIS_TOKEN;delete process.env.COMMUNITY_ORIGIN;});
