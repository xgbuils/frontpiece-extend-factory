var objectAssign = require('object-assign')

function extendFactory (specialMethods) {
    var extend = function (props) {
        props || (props = {})
        var parent = this
        var child  = function (attrs, options) {
            parent.call(this, attrs, options)
        }

        var special = {}
        for (var prop in specialMethods) {
            special[prop] = props[prop]
            delete props[prop]
        }

        child.prototype = Object.create(parent.prototype)
        child.prototype.constructor = child
        objectAssign(child.prototype, props)
        for (var prop in special) {
            if (special[prop]) {
                child.prototype[prop] = function () {
                    var args = [].push.apply([special[prop]], arguments)
                    specialMethods[prop].apply(this, args)
                }
            }
        }
        child.extend = extend

        return child
    }

    return extend
}

module.exports = extendFactory