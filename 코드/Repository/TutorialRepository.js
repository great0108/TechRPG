(function() {
    "use strict"
    const TutorialDao = require("../Dao/TutorialDao")
    const TutorialDto = require("../Dto/TutorialDto")
    const ListDto = require("../Dto/ListDto")

    const TutorialRepository = {
        getTutorial : function(nameDto) {
            let tutorial = TutorialDao.read(nameDto.name)
            return new TutorialDto(tutorial)
        },
        getTutorialList : function() {
            let list = TutorialDao.list()
            return new ListDto(list)
        }
    }

    module.exports = TutorialRepository
})()