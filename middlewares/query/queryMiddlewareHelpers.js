//const asyncErrorWraper = require("express-async-handler");

const searchHelper = (searchKey,query,req) => {
    
    if(req.query.search){
        //searchObject içine neye göre nasıl arama yapıldığını alıcak
        const searchObject = {};
        //Aramayı Düzeltiyoruz
        const regex = new RegExp(req.query.search,"i");
        //searchObjectimize neye göre neyi neyi araması gerektiğini söylüyoruz
        searchObject[searchKey] = regex;
        //Sonra gelen query objemize göre searchObjectimizi parametre olarak veriyoruz ve döndürüyoruz
        return query = query.where(searchObject);
    }
    //Eğer Arama Verilmemişse Default Değer Olarak Döndürüyoruz
    return query;

}

const populateHelper = (query,population) => {
    return query.populate(population);
}

const questionSortHelper = (query,req) => {
    const sortKey = req.query.sortBy;

    if(sortKey === "most-answered"){
        return query.sort("-answerCount");
    }
    if(sortKey === "most-liked"){
        return query.sort("-likeCount");
    }

    return query.sort("-createdAt");
  
}

const paginationHelper = async (totalDocuments,query,req) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const pagination = {};
    const total = totalDocuments

    if(startIndex > 0) {
        pagination.previous = {
            page : page + 1,
            limit : limit

        }
    } 

    if(endIndex < total) {
        pagination.next = {
            page : page - 1,
            limit : limit
        }
    }

    return {
        query : query === undefined ? undefined : query.skip(startIndex).limit(limit),
        pagination : pagination,startIndex,limit
    }

    
}


module.exports = {
    searchHelper,
    populateHelper,
    questionSortHelper,
    paginationHelper
};