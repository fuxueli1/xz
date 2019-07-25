//引入第三方模块
const express=require('express');
//引入连接池模块(引入上一级文件../  引入同级文件./)
const pool=require('../pool.js');
//创建路由器对象
var router=express.Router();
//添加路由
//1.用户注册
router.post('/reg',function(req,res){
	var obj=req.body;
	console.log(obj);
	//验证数据是否为空  !obj.uname  或  obj.uname==''
	if (obj.uname=='')
	{
		res.send({code:401,msg:'uname required'});
		//阻止往后执行
		return;
	}
	if (!obj.upwd)
	{
		res.send({code:402,msg:'upwd required'});
		return;
	}
	if (obj.email=='')
	{
		res.send({code:403,msg:'email required'});
		return;
	}
	if (obj.phone=='')
	{
		res.send({code:404,msg:'phone required'});
		return;
	}
	//执行SQL语句
	pool.query('INSERT INTO xz_user SET ?',[obj],function(err,result){
		if (err) throw err;
			//console.log(result); 用于测试
			//如果注册成功,响应{code:200,msg:'register suc'}
			if (result.affectedRows>0)
			{
				res.send({code:200,msg:'register suc'});
			}
	});

});

//2,用户登录
router.post('/login',function(req,res){
	var obj=req.body;
	console.log(obj);
	//验证数据是否为空
	if (!obj.uname)
	{
		res.send({code:401,msg:'uname required'});
		return;
	}
	if (!obj.upwd)
	{
		res.send({code:402,msg:'pwd required'});
		return;
	}
	//执行SQL语句
	pool.query('SELECT * FROM xz_user WHERE uname=? AND upwd=?',[obj.uname,obj.upwd],function(err,result){
		if (err) throw err;
		//console.log(result);
		//判断是否登录成功
		if (result. length>0)
		{
			res.send({code:200,msg:'login suc'});
		}else{
			res.send({code:301,msg:'login err'});
		}
	});
	
});

//3,检索用户
router.get('/detail',function(req,res){
	//获取数据
	var obj=req.query;
	console.log(obj);
	//验证是否为空
	if (!obj.uid)
	{
		res.send({code:401,msg:'uid required'});
		return;
	}
	//执行SQL语句
	pool.query('SELECT * FROM xz_user WHERE uid=?',[obj.uid],function(err,result){
		if (err) throw err;
		//console.log(result);
		//是否检索到用户,如果检索到,把该用户的对象响应到浏览器,否则响应检索不到
		if (result.length>0)
		{
			res.send(result[0]);
		}else{
			res.send({code:301,msg:'can not found'});
		}
	});
});

//4,修改用户
router.get('/update',function(req,res){
	//获取数据
	var obj=req.query;
	console.log(obj);
	//批量验证数据是否为空
	//对对象进行遍历,获取对象的每个属性值
	var i=400;
	for (var key in obj )
	{
		i++;
		//console.log(key,obj[key]);//obj[key] 表示每个属性的属性值
		//如果属性值为空,则提示属性名是必须的
		if (!obj[key])
		{
			res.send({code:i, msg:key+' required'});
			return;
		}
	}
	//执行SQL语句
	pool.query('UPDATE xz_user SET ? WHERE uid=?',[obj,obj.uid],function(err,result){
		if (err) throw err;
		//判断是否修改成功
		if (result.affectedRows>0)
		{
			res.send({code:200,msg:'update suc'});
		}else{
			res.send({code:301,mdg:'update err'});
		}
	});
});

//5,用户列表
router.get('/list',function(req,res){
	//获取数据
	var obj=req.query;
	console.log(obj);
	//验证数据是否为空
	var pno=obj.pno;
	var size=obj.size;
	if (!pno) pno=1;//如果为空,默认值为1	
	if (!size) size=3;
	//转为整型
	pno=parseInt(pno);
	size=parseInt(size);
	//计算开始查询的值(分页查询)
	var start=(pno-1)*size
	//执行SQL语句
	pool.query('SELECT * FROM xz_user LIMIT ?,?',[start,size],function(err,result){
		if (err) throw err;
		res.send(result);
	});
});

//6,删除用户
router.get('/delete',function(req,res){
	//获取数据
	var obj=req.query;
	//console.log(obj);
	//验证是否为空
	if (!obj.uid)
	{
		res.send({code:401,msg:'uid required'});
		return;
	}
	//执行SQL语句
	pool.query('DELETE FROM xz_user WHERE uid=?',[obj.uid],function(err,result){
		if (err) throw err;
		//console.log(result);
		if (result.affectedRows>0)
		{
			res.send({code:200,msg:'delete suc'});
		}else{
			res.send({code:301,msg:'delete err'});
		}
	});
});

//导出路由器对象
module.exports=router;










