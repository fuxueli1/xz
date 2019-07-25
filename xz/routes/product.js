//创建第三方模块
const express=require('express');
//创建路由器对象
var router=express.Router();
//引入连接池模块
var pool=require('../pool.js');

//添加路由
//1.商品列表
router.get('/list',function(req,res){
	//获取数据
	var obj=req.query;
	console.log(obj);
	//验证是否为空
	var pno=obj.pno;
	var size=obj.size;
	if (!pno) pno=1;
	if (!size) size=9;
	//转为整型
	pno=parseInt(pno);
	size=parseInt(size);
	//计算开始查询start
	var start=(pno-1)*size;
	//执行SQL语句,查询商品编码,价格和标题
	pool.query('SELECT lid,price,title FROM xz_laptop LIMIT ?,?',[start,size],function(err,result){
		if (err) throw err;
		res.send(result);
	});
});

//2.商品详情


//3.商品添加


//4.删除商品


//5.修改商品


//导出路由器
module.exports=router;


