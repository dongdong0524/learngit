//全局过滤器  必须放在new Vue之前，否则报错警告
Vue.filter("moneyFormat",function(v){
	return "￥"+v.toFixed(2) +"元";
});

new Vue({
	el:'#app',
	data:{
		productList:[],  //数据数组
		productQuantity:1,  //数量
		checkAllFlag:false,  //是否选中
		totalMoney:0,  //计算总金额
		isShowFlag:false,  //是否显示遮罩层
		sureDelete:''
	},
	filters:{ //局部过滤器
		formatMoney:function(value){
			return "￥"+value.toFixed(2);
		}
	},
	mounted:function(){
		//保证dom生成完毕，
		this.$nextTick( ()=>{   //这里一定用es6  避免this错误 
			this.cartView();    //请求后台 获取数据
		})
	},
	methods:{
		//初始化获取数据  后台
		cartView: function() {
      		this.$http.get("data/cartData.json").then(function(res) {
		      	console.log(res);
		        this.productList = res.body.result.list; //数据放入数组
		        this.totalMoney = res.body.result.totalMoney;
      		});
    	},
    	//点击增加和减少 
    	changeNumber:function(pro,type){
    		if(type >0){
    			pro.productQuantity ++;  //+1
    		}else{
    			pro.productQuantity --;
    			if(pro.productQuantity <1){
    				pro.productQuantity=1;
    			}
    			
    		}
    		this.calcTotalPrice(); //重新调取计算方法
    		
    	},
    	//单选
    	checkStyle:function(action){
    		//默认没选中
    		if(typeof action.isCheck == 'undefined'){
    			this.$set(action,'isCheck',true);  //设置参数
    			
    		}else{
    			action.isCheck= !action.isCheck; //点击取消  取反
    		};
    		this.calcTotalPrice();

    	},
    	//全选
    	checkAll:function(flag){
    		this.checkAllFlag=flag;  //初始化 为true
    		this.productList.forEach((item,index) => {  //遍历
    			if(this.checkAllFlag , typeof item.isCheck=='undefined'){
    				this.$set(item,'isCheck',true);   //设置参数
    			}else{ 
    				//item.isCheck=true;
    				item.isCheck=this.checkAllFlag; //设置参数
    			}
    		});
    		this.calcTotalPrice();  //重新调取计算方法
    		
    	},
    	//注意 取消全选 可以用false 参数来控制 
    	//取消全选  
    	/*可以提取为一个方法 用参数控制 */
    	cancelCheckAll:function(flag){
    		this.checkAllFlag=flag;   //初始化 为false
    		this.productList.forEach((item,index) => {
    			if(this.checkAllFlag , typeof item.isCheck=='undefined'){
    				this.$set(item,'isCheck',false); 
    			}else{
    				item.isCheck=this.checkAllFlag;
    			}
    		});
    		this.calcTotalPrice();  //重新调取计算方法
    	},
    	//删除
    	deleteItem:function(data){
    		//console.log(ev.target);
    		//console.log(data+'=='+ev.target);
    		this.isShowFlag=true;  //让删除确认框 出现   class为true  
    		
    		this.sureDelete=data;  //缓存下item为data，传递给下面的确认使用  
    		//var  index=this.productList.indexOf(data);
    		//this.productList.splice(index,1);

    	},
    	//是 删除
    	yesDelete:function(){
    		//获取数组中当前索引，传递过来的item为,这里不是循环里面，所以获取不到item，只能从上面传递过来
    		var  index=this.productList.indexOf(this.sureDelete );
    		this.productList.splice(index,1);  //删除
    		this.isShowFlag=false;   //关闭遮罩层
    		this.calcTotalPrice();  //重新调取计算方法
    	},
    	
    	//计算总金额
    	calcTotalPrice:function(){
    		this.totalMoney=0; //必须重置为0
    		//遍历整个数组 计算
    		this.productList.forEach( (item,index)=>{  //es6
    			if(item.isCheck){  //如果选中 就累加
    				this.totalMoney += (item.productQuantity * item.productPrice);  //金额=数量*单价
    			}
 
    		});

    	}

		
	}
	

	
});




