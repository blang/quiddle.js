module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        connect: {
            server: {
                options: {
                    port: 3000,
                    base: '.'
                }
            }
        },

        uglify: {
            options: {
                banner: '/*!\n<%= pkg.name %>\n(c) 2013 Benedikt Lang <github at benediktlang.de>\nLicense: MIT\nBuild: <%= grunt.template.today("yyyy-mm-dd") %>\n*/\n'
            },
            build: {
                src: 'src/*.js',
                dest: 'build/<%= pkg.name %>.min.js'
            }
        }, 

        jshint: {
            files: ['src/*.js']
        },

        clean: {
            build: ['build'],
            tmp: ['tmp']
        }
    });

    //Load Tasks
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-connect');
    
    // Default task
    grunt.registerTask('default', ['clean', 'jshint', 'uglify']);
    grunt.registerTask('package', ['default']);
    grunt.registerTask('webserver', ['connect:server:keepalive']);
};
