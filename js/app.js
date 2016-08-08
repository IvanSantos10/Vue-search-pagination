
Vue.filter('moment', function (date) {
    return moment(date).format('DD/MM/YYYY');
});

Vue.filter('MySearch', function (arr, sortKey, reverse) {
    console.log(arr, sortKey, reverse);
    arr = convertArray(arr)
    if (!sortKey) {
        return arr
    }
    var order = (reverse && reverse < 0) ? -1 : 1
    // sort on a copy to avoid mutating original array
    return arr.slice().sort(function (a, b) {
        if (sortKey !== '$key') {
            if (isObject(a) && '$value' in a) a = a.$value
            if (isObject(b) && '$value' in b) b = b.$value
        }
        a = isObject(a) ? getPath(a, sortKey) : a
        b = isObject(b) ? getPath(b, sortKey) : b

        // Our new lines
        a = a.toLowerCase()
        b = b.toLowerCase()

        return a === b ? 0 : a > b ? order : -order
    })
});



var app = new Vue({
    el: '#app',
    data:{
        products: [],
        MySearch: '',
        orderCol: 'id',
        orderInverse: 1,
        pagination:{
            maxPage:10,
            current:1,
            totalItems:0,
            totalPages:0,
            listPagination:[]
        },
        MySearch: ''
    },
    methods:{

        filterOrderBy:function(e,col){
            e.preventDefault();
            this.orderCol = col;
            this.orderInverse = this.orderInverse * -1
        },
        previous:function(e){
            e.preventDefault();

            console.log(this.MySearch);

            if(this.pagination.current === 1){
                return false;
            }

            this.pagination.current = this.pagination.current - 1;

            this.products = this.pagination.listPagination[this.pagination.current - 1];

        },
        pagePagination:function(e, corrent){
            e.preventDefault();

            this.pagination.current = corrent + 1;

            this.products = this.pagination.listPagination[corrent];
        },
        next:function(e){
            e.preventDefault();

            if(this.pagination.current === this.pagination.totalPages){
                return false;
            }

            this.pagination.current = this.pagination.current + 1;

            this.products = this.pagination.listPagination[this.pagination.current - 1];
        }

    },

    ready:function(){
        var self = this;
        self.$http.get('dataServe.json').then(function(rep){

            self.pagination.totalItems = rep.data.length;
            self.pagination.totalPages = Math.ceil(rep.data.length/ self.pagination.maxPage);

            var aux = [];
            for(var k in rep.data){
                aux.push(rep.data[k]);
                if(aux.length === self.pagination.maxPage){
                    self.pagination.listPagination.push(aux);
                    aux = [];
                }
            }
            if(aux.length > 0){
                self.pagination.listPagination.push(aux);
            }
            //console.log( self.pagination.listPagination);
            self.products = self.pagination.listPagination[0];
        });

    }
});