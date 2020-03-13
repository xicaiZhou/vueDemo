 import {
     request
 } from '@/common/request.js';

 // 查询片区
export const regionFind = (params) => {
    return request({
        method: "post",
        url: "/region/find",
        data: params
    })
}

 // 查询所有的片区
 export const regionFindAllTree = (params) => {
    return request({
        method: "post",
        url: "/region/findAllTree",
        data: params
    })
}

 // 新建片区
export const regionSave = (params) => {
    return request({
        method: "post",
        url: "/region/save",
        data: params
    })
}

 // 编辑片区
 export const regionUpdate = (params) => {
    return request({
        method: "post",
        url: "/region/update",
        data: params
    })
}

 // 删除片区
 export const regionRemove = (params) => {
    return request({
        method: "get",
        url: "/region/remove",
        params: params
    })
}

// 地铁管理
// 地铁线路
export const subwayFindSubway = (params) => {
    return request({
        method: "post",
        url: "/subway/findSubway",
        data: params
    })
}

// 地铁站点
export const subwayFindStation = (params) => {
    return request({
        method: "post",
        url: "/subway/findStation",
        data: params
    })
}

// 城市查询
export const subwaySubwayCity = (params) => {
    return request({
        method: "post",
        url: "/subway/subwayCity",
        data: params
    })
}

// 新增地铁
export const subwaySaveSubway = (params) => {
    return request({
        method: "post",
        url: "subway/saveSubway",
        data: params
    })
}

// 新增地铁站点
export const subwaySaveStation = (params) => {
    return request({
        method: "post",
        url: "/subway/saveStation",
        data: params
    })
}

// 修改地铁
export const subwayUpdateSubway = (params) => {
    return request({
        method: "post",
        url: "/subway/updateSubway",
        data: params
    })
}

// 修改地铁站
export const subwayUpdateStation = (params) => {
    return request({
        method: "post",
        url: "/subway/updateStation",
        data: params
    })
}



//删除地铁
export const subwayRemoveSubway = (params) => {
    return request({
        method: "post",
        url: "/subway/removeSubway",
        params: params
    })
}

//删除地铁
export const subwayRemoveStation = (params) => {
    return request({
        method: "post",
        url: "/subway/removeStation",
        params: params
    })
}


/*
楼盘管理
*/
// 城市查询
export const buildingFind = (params) => {
    return request({
        method: "post",
        url: "/building/find",
        data: params
    })
}

// 楼盘查重
export const buildingFindByName = (params) => {
    return request({
        method: "get",
        url: "/building/findByName",
        params: params
    })
}

// 楼盘保存
export const buildingSave = (params) => {
    return request({
        method: "post",
        url: "/building/save",
        data: params
    })
}

// 楼盘保存
export const buildingUpdate = (params) => {
    return request({
        method: "post",
        url: "/building/update",
        data: params
    })
}

// 楼盘删除
export const buildingRemove = (params) => {
    return request({
        method: "get",
        url: "/building/remove",
        params: params
    })
}

/**
 * 楼盘字典
 */

// 楼盘查询
export const buildingFindAll = (params) => {
    return request({
        method: "post",
        url: "/building/findAll",
        data: params
    })
}
// 字典上传
export const fileUpload = (params) => {
    return request({
        method: "get",
        url: "/file/upload",
        params: params
    })
}

// 保存楼号信息
export const dictionarySaveEdifice = (params) => {
    return request({
        method: "post",
        url: "/dictionary/saveEdifice",
        data: params
    })

}

// 更新楼号信息
export const dictionaryUpdateEdifice = (params) => {
    return request({
        method: "post",
        url: "/dictionary/updateEdifice",
        data: params
    })
}

// 查询楼号信息
export const dictionaryFindEdifice = (params) => {
    return request({
        method: "post",
        url: "/dictionary/findEdifice",
        data: params
    })
}


// 保存单元信息
export const dictionarySaveUnit = (params) => {
    return request({
        method: "post",
        url: "/dictionary/saveUnit",
        data: params
    })
}

// 保存单元信息
export const dictionaryUpdateUnit = (params) => {
    return request({
        method: "post",
        url: "/dictionary/updateUnit",
        data: params
    })
}

// 查询单元信息
export const dictionaryFindUnit = (params) => {
    return request({
        method: "post",
        url: "/dictionary/findUnit",
        data: params
    })
}


// 保存楼层信息
export const dictionarySaveFlower = (params) => {
    return request({
        method: "post",
        url: "/dictionary/saveFlower",
        data: params
    })
}

// 查询楼层信息
export const dictionaryFindFlower = (params) => {
    return request({
        method: "post",
        url: "/dictionary/findFlower",
        data: params
    })
}

// 修改楼层信息
export const dictionaryUpdateFlower = (params) => {
    return request({
        method: "post",
        url: "/dictionary/updateFlower",
        data: params
    })
}

// 保存门牌号信息
export const dictionarySaveFamily = (params) => {
    return request({
        method: "post",
        url: "/dictionary/saveFamily",
        data: params
    })
}

// 查询门牌号信息
export const dictionaryFindFamily = (params) => {
    return request({
        method: "post",
        url: "/dictionary/findFamily",
        data: params
    })
}

// 查询门牌号信息
export const dictionaryUpdateFamily = (params) => {
    return request({
        method: "post",
        url: "/dictionary/updateFamily",
        data: params
    })
}

// 删除楼号信息
export const dictionaryRemoveEdifice = (params) => {
    return request({
        method: "GET",
        url: "/dictionary/removeEdifice",
        params: params
    })
}

// 删除单元信息
export const dictionaryRemoveUnit = (params) => {
    return request({
        method: "GET",
        url: "/dictionary/removeUnit",
        params: params
    })
}

// 删除楼层信息
export const dictionaryRemoveFlower = (params) => {
    return request({
        method: "GET",
        url: "/dictionary/removeFlower",
        params: params
    })
}


// 删除门牌号信息
export const dictionaryRemoveFamily = (params) => {
    return request({
        method: "GET",
        url: "/dictionary/removeFamily",
        params: params
    })
}
