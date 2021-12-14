function test (){
var EnhancedCacheService = wrap(CacheService.getUserCache());

//Use the same basic API as in the native cache
EnhancedCacheService.put('k1','Hello World!');
EnhancedCacheService.put('k2','Beam me up, Scotty',20); //with time-to-live set to 20 seconds
var s = EnhancedCacheService.get('k1'); //s === 'Hello World!'
EnhancedCacheService.remove('k2');

//Use new methods for specific value types
EnhancedCacheService.putNumber('n1',7);
var n = EnhancedCacheService.getNumber('n1'); //n === 7
EnhancedCacheService.putBoolean('b1',true,60); //with time-to-live set to 1 minute
var b = EnhancedCacheService.getBoolean('b1'); //b === true
EnhancedCacheService.putObject('o1',{ name: 'John', age: 30 });
var p = EnhancedCacheService.getObject('o1'); //p.name === 'John' && p.age === 30
//Objects also support custom parsing and stringifying
EnhancedCacheService.putObject('d1',new Date(),undefined,function(d) { return '' + d.getTime(); });
var d = EnhancedCacheService.getObject('d1',function(s) { return new Date(+s); });
//Get the date an entry was last updated
var k1lu = EnhancedCacheService.getLastUpdated('k1'); //k1lu === a Date instance

console.log (n, b, p, d, k1lu)
console.log (p.name, p.age)
}