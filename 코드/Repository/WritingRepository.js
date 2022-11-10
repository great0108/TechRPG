(function() {
    "use strict"
    const WritingDao = require("../Dao/WritingDao")
    const WritingDto = require("../Dto/WritingDto")
    const ListDto = require("../Dto/ListDto")
    const IsExistDto = require("../Dto/IsExistDto")

    const WritingRepository = {
        getWriting : function(nameDto) {
            let text = WritingDao.read(nameDto.name)
            return new WritingDto(text)
        },
        getWritingList : function() {
            let list = WritingDao.list()
            return new ListDto(list)
        },
        setWriting : function(makeWritingDto) {
            WritingDao.write(makeWritingDto.title, makeWritingDto.text)
        },
        deleteWriting : function(nameDto) {
            WritingDao.delete(nameDto.name)
        },
        isExist : function(nameDto) {
           let exist = WritingDao.isExist(nameDto.name)
           return new IsExistDto(exist)
        }
    }

    module.exports = WritingRepository
})()