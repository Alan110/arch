
fis.set('project.files', [
    '/src/**',
    '/test/**'
]);

fis.hook('amd', {});

fis.match('src/(*).js',{
    isMod: true,
    moduleId: '$1'
});

