// (function() {
    "use strict"
    const Dao = require("./Dao")
    const File = require("../Util/File")
    const Copy = require("../Util/Copy")
    const Err = require("../Util/Err")

    const BiomeDao = {
        data : File.load("Biome"),
        read : function(name) {
            if(!this.data[name]) {
                Err.NotExistBiome()
            }
            return Copy.deepcopy(this.data[name])
        },
        write : function(name, biome) {
            this.data[name] = biome
        },
        delete : function(name) {
            delete this.data[name]
        },
        load : function() {
            this.data = File.load("Biome")
        },
        save : function() {
            File.save("Biome", this.data)
        },
        isExist : function(name) {
            return Boolean(this.data[name])
        }
    }
    BiomeDao.__proto__ = Dao

    module.exports = BiomeDao
// })()