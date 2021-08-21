/**
 * Make synthetic InBox count to put in cache
 */

function makeCache (total) {
    cache.put('inBoxCache', total, 1800)
}