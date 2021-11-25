export default {
    data() {
        return {
            loading: true,
            listQuery: {
                total: 0,
                pageNum: 1,
                pageSize: 10,
            },
            /** 选中的数据 */ 
            selectRows: []
        }
    },
    methods: {
        /** 多选框选中数据 */ 
        handleSelectionChange(selection) {
            this.selectRows = selection;
         },
    },
}