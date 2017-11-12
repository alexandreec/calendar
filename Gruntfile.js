/* jshint node:true */
module.exports = function (grunt) {

	// Configuration
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
		'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
		'<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
		'* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
		' Licensed <%= pkg.license %> */\n\n',
		clean: {
			build: ['dist']
		},
		json: {
			locale: {
				options: {
					namespace: 'ZabutoCalendarTranslations',
					includePath: false,
					processName: function (filename) {
						return filename.toLowerCase();
					}
				},
				src: ['locale/**/*'],
				dest: 'dist/<%= pkg.name %>.js'
			}
		},
		concat: {
			options: {
				banner: '<%= banner %>',
				stripBanners: true
			},
			js: {
				src: ['src/jquery.<%= pkg.name %>.js', 'dist/<%= pkg.name %>.js'],
				dest: 'dist/<%= pkg.name %>.js'
			},
			css: {
				src: ['src/jquery.<%= pkg.name %>.css'],
				dest: 'dist/<%= pkg.name %>.css'
			}
		},
		uglify: {
			options: {
				banner: '<%= banner %>'
			},
			build: {
				src: 'dist/<%= pkg.name %>.js',
				dest: 'dist/<%= pkg.name %>.min.js'
			}
		},
		cssmin: {
			target: {
				files: {
					'dist/<%= pkg.name %>.min.css': ['dist/<%= pkg.name %>.css']
				}
			}
		},
		jshint: {
			options: {
				jshintrc: true,
				reporterOutput: ""
			},
			gruntfile: {
				src: ['Gruntfile.js']
			},
			src: {
				src: ['src/**/*.js']
			},
			test: {
				src: ['test/**/*.js']
			}
		},
		watch: {
			gruntfile: {
				files: '<%= jshint.gruntfile.src %>',
				tasks: ['jshint:gruntfile']
			},
			src: {
				files: '<%= jshint.src.src %>',
				tasks: ['jshint:src']
			},
			test: {
				files: '<%= jshint.test.src %>',
				tasks: ['jshint:test']
			}
		}
	});

	// Load plugins
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-json');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');

	// Tasks
	grunt.registerTask('default', ['jshint', 'clean', 'json', 'concat', 'uglify', 'cssmin']);

};
