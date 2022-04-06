let tree = [{
    name: '第一层文件夹',
    type: 'folder',
    sub: [{
            name: '第二层文件',
            type: 'file',
        }, {
            name: '第二层文件-提供图标',
            type: 'file',
            icon: 'style/img/file_type_image.svg'
        },

    ]
}, {
    name: '第一层文件夹-提供图标',
    type: 'folder',
    icon: 'style/img/folder_type_images_opened.svg',
    sub: [{
        name: '第二层文件',
        type: 'file',
    }, {
        name: '第二层文件夹',
        type: 'folder',
        sub: [{
                name: '第三层文件',
                type: 'file',
            }, {
                name: '第三层文件-提供图标',
                type: 'file',
                icon: 'style/img/file_type_image.svg'
            }, {
                name: '第三层文件夹',
                type: 'folder',
                sub: [{
                        name: '第四层文件',
                        type: 'file',
                    }, {
                        name: '第四层文件',
                        type: 'file',
                    }, {
                        name: '第四层文件夹',
                        type: 'folder',
                        sub: [{
                                name: '第五层文件',
                                type: 'file',
                            }, {
                                name: '第五层文件',
                                type: 'file',
                            },

                        ]
                    },

                ]
            },

        ]
    }, ]
}, {
    name: '第一层文件',
    type: 'file',
}, ]


let FV = new FileView();
let formatTree = FV.formatDirectory(tree)
let view = FV.createViewSync(formatTree);
let box = document.getElementsByClassName('file_view_box')[0];
box.appendChild(view);