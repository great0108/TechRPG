(function() {
    "use strict"

    /** Dao 추상 클래스 */
    const Dao = {
        /** 캐시 데이터 */
        data : null,

        /** 특정 데이터 가져오기 */
        read : function() {},

        /** 특정 데이터 쓰기 */
        write : function() {},

        /** 특정 데이터 삭제하기 */
        delete : function() {},

        /** 파일에서 데이터 불러오기 */
        load : function() {},

        /** 캐시 데이터를 파일에 저장 */
        save : function() {},

        /** 특정 데이터가 있는지 확인 */
        isExist : function() {},
        
        /** 데이터 목록 가져오기 */
        list : function() {}
    }

    module.exports = Dao
})()