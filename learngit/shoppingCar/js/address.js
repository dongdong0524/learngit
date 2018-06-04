new Vue({
	el:'.container',
	data:{
		arr:[],//存放后台数据
		limitNum:3,  //限制数量
		currentIndex: 0,  //当前索引 
		isCheck:false,  //是否选中
		shippingMethod:1,  //标准配送
		deleteIndex:'',
		sureDelete:false,   //遮罩层默认不显示class
		flagAddress:false,
		dialog:false,  //阴影层
		username:'',
		address:'',
		telPhone:''
		
	},
	//开始挂载
	mounted:function(){
		//初始化
		this.$nextTick( ()=>{
			this.getAddress();
		});
	},
	methods:{
		//请求后台 
		getAddress(){
			this.$http.get('./data/address.json').then((res)=>{  //es6
				console.log(res);
				if(res.status==200){
					var  data=res.body.result;
					this.arr=data;
				}
				
				
			})
			
		},
		//加载更多
		more:function(){
			this.limitNum=this.arr.length;
		},
		//设为默认
		setDefault:function(data){  //data为传过来的地址id
			this.arr.forEach(function(value,index){  //遍历循环  value 为整个数组
				if(value.addressId==data){  //如果数组的地址id==传过来的id 就说明是当前一致
					value.isDefault=true;  //设置为默认  改变里面的字段
				}else{
					value.isDefault=false;
				}
				
			});
			
		},
		//删除
		deleteItem:function(item){
			//var index= this.arr.indexOf(item);
			//this.arr.splice(index,1);
			this.deleteIndex=item;  //重新缓存一个对象 传递给下面确认使用  
			this.sureDelete=true;  //打开遮罩层
			this.dialog=true;  //阴影层
			
		},
		//确认删除
		yesDelete:function(){
			//获取删除的对象 在数组中的index 
			var index= this.arr.indexOf(this.deleteIndex);
			this.arr.splice(index,1);  //删除
			this.sureDelete=false;  //关闭遮罩层 
			this.dialog=false;
		},
		//添加地址
		addAddress:function(){
			this.flagAddress=true;
			this.dialog=true;
			
			
		},
		//保存
		save:function(){
			this.arr.push({  //添加数据  
				userName:this.username,
				streetName:this.address,
				tel:this.telPhone
				
			});
			
			this.flagAddress=false;
			this.dialog=false;
			
			
		}
		
		
	},
	computed:{  //计算属性
		filterAddress:function(){   //
			return this.arr.slice(0,this.limitNum);  //返回截取数组中截取前3个
		}
		
	}

	
	
});
