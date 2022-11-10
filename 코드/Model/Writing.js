(function() {
    "use strict"
    const WritingRepository = require("../Repository/WritingRepository")
    const NameDto = require("../Dto/NameDto")
    const MakeWritingDto = require("../Dto/MakeWritingDto")

    const Writing = {
        read : function(title) {
            let nameDto = new NameDto(title)
            return WritingRepository.getWriting(nameDto)
        },
        write : function(title, text) {
            let makeWritingDto = new MakeWritingDto(title, text)
            WritingRepository.setWriting(makeWritingDto)
        },
        append : function(title, text) {
            let a = this.read(title)
            a += "\n" + text
            this.write(title, a)
            return a
        },
        delete : function(title) {
            let nameDto = new NameDto(title)
            WritingRepository.deleteWriting(nameDto)
        },
        list : function() {
            return WritingRepository.getWritingList()
        },
        search : function(word) {
            let list = this.list()
            return list.filter(v => v.includes(word))
        }
    }

    module.exports = Writing
})()