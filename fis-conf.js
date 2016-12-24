
// 工程文件配置
fis.set('project.files', [
    '/src/**',
    '/test/**'
]);


// es6 配置
fis.config.set('project.fileType.text', 'es');
fis.config.set('modules.parser.es', 'babel-6.x');
fis.config.set('roadmap.ext.es', 'js');

fis.set('project.fileType.text', 'es');
fis.match('/src/(*).es', {
    parser: fis.plugin('babel-6.x', {
        // preset: [
        // 注意一旦这里在这里添加了preset配置，则会覆盖默认加载的preset-2015等插件，因此需要自行添加所有需要使用的preset
        // ]
    }),
    rExt: 'js',
    isMod: true,
    moduleId: '$1'
});

fis.hook('amd', {});

// fis.match('src/(*).js',{
//     isMod: true,
//     moduleId: '$1'
// });

