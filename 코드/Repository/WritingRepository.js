(function() {
    "use strict"
    const WritingDao = require("../Dao/WritingDao")
    const WritingDto = require("../Dto/WritingDto")
    const ListDto = require("../Dto/ListDto")
    const IsExistDto = require("../Dto/IsExistDto")

    /** 글 Repository 클래스 */
    const WritingRepository = {
        /**
         * 글이 있는지 확인
         * @param {NameDto} nameDto 
         * @returns {IsExistDto}
         */
        isExist : function(nameDto) {
            let exist = WritingDao.isExist(nameDto.name)
            return new IsExistDto(exist)
        },

        /**
         * 특정 제목의 글 내용을 가져옴
         * @param {NameDto} nameDto 
         * @returns {WritingDto}
         */
        getWriting : function(nameDto) {
            let text = WritingDao.read(nameDto.name)
            return new WritingDto(text)
        },

        /**
         * 글 목록을 가져옴
         * @returns {ListDto}
         */
        getWritingList : function() {
            let list = WritingDao.list()
            return new ListDto(list)
        },

        /**
         * 특정 제목의 글 내용을 덮어 씀
         * @param {MakeWritingDto} makeWritingDto 
         */
        setWriting : function(makeWritingDto) {
            WritingDao.write(makeWritingDto.title, makeWritingDto.text)
            WritingDao.save()
        },

        /**
         * 특정 제목의 글을 삭제함
         * @param {NameDto} nameDto 
         */
        deleteWriting : function(nameDto) {
            WritingDao.delete(nameDto.name)
            WritingDao.save()
        }
    }

    module.exports = WritingRepository
})()