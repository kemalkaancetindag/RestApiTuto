const asyncErrorWraper = require("express-async-handler");
const {populateHelper,searchHelper,questionSortHelper,paginationHelper} = require("./queryMiddlewareHelpers");


const questionQueryMiddleware = function(model,options){

    return asyncErrorWraper(async function(req,res,next){
        //Initial Query

        let query = model.find();

        //Search

        query = searchHelper("title",query,req)

        if(options && options.population){
            query = populateHelper(query,options.population);
        }
        
        //Sort

        query = questionSortHelper(query,req);

        //Pagination
        const total = await model.countDocuments();

        const paginationResult = await paginationHelper(total,query,req);

        query = paginationResult.query;

        const pagination = paginationResult.pagination;

        //RUN THAT QUERY BOIIIII !!!!

        const queryResults = await query;

        res.queryResults = {
            success : true,
            count : queryResults.length,
            pagination : pagination,
            data : queryResults
        }

        next();

    })

}


module.exports = questionQueryMiddleware;