(function() {
    "use strict"
    const WritingRepository = require("../Repository/WritingRepository")
    const NameDto = require("../Dto/NameDto")
    const MakeWritingDto = require("../Dto/MakeWritingDto")

    /** 글 관련 기능을 하는 모듈 */
    const Writing = {
        /**
         * 특정 제목의 글이 있는지 확인
         * @param {string} title 
         * @returns {boolean}
         */
        isExist : function(title) {
            let nameDto = new NameDto(title)
            return WritingRepository.isExist(nameDto).isExist
        },

        /**
         * 특정 제목의 글을 가져옴
         * @param {string} title 
         * @returns {string}
         */
        read : function(title) {
            let nameDto = new NameDto(title)
            return WritingRepository.getWriting(nameDto).text
        },

        /**
         * 특정 제목의 글을 덮어 씀
         * @param {string} title 
         * @param {string} text 
         */
        write : function(title, text) {
            let makeWritingDto = new MakeWritingDto(title, text)
            WritingRepository.setWriting(makeWritingDto)
        },

        /**
         * 특정 제목의 글을 이어 씀
         * @param {string} title 
         * @param {string} text 
         * @returns {string}
         */
        append : function(title, text) {
            let a = this.read(title)
            a += "\n" + text
            this.write(title, a)
            return a
        },

        /**
         * 특정 제목의 글을 삭제함
         * @param {string} title 
         */
        delete : function(title) {
            let nameDto = new NameDto(title)
            WritingRepository.deleteWriting(nameDto)
        },

        /**
         * 글 목록을 각져옴
         * @returns {string[]}
         */
        list : function() {
            return WritingRepository.getWritingList().list
        },

        /**
         * 제목에 검색어를 포함한 글 목록을 가져옴
         * @param {string} word 
         * @returns {string[]}
         */
        search : function(word) {
            let list = this.list()
            return list.filter(v => v.includes(word))
        }
    }

    module.exports = Writing
})()