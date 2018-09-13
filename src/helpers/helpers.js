  /**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
export const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const isEmpty = (obj) => {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false
    }
    return true
}

export const checkNestedProps = (obj, level1) => {
    var args = Array.prototype.slice.call(arguments, 1)
  
    for (var i = 0; i < args.length; i++) {
      if (!obj || !obj.hasOwnProperty(args[i])) {
        return false
      }
      obj = obj[args[i]]
    }
    return true
  }