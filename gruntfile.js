module.exports = function(grunt) {
	grunt.initConfig({
		// pkg: grunt.file.readJSON('package.json'),
		// clean: {
		// 	src: 'build/'
		// },
		// useminPrepare: {
		// 	html: 'build/index.html',
		// 	options: {
		// 		dest: 'build'
		// 	}
		// },
		// uglify: {
		// 	buildrelease: {
		// 		options: {
		// 			report: "min" //输出压缩率
		// 		}
		// 	}
		// },
		// usemin: {
		// 	html: 'build/index.html',
		// 	options: {
		// 		dest: 'build'
		// 	}
		// },
		// copy: {
		// 	html: {
		// 		files: [{
		// 			expand: true,
		// 			cwd: 'src',
		// 			src: '**/*',
		// 			dest: 'build/'
		// 		}]
		// 	}
		// },

		jshint: {
			options: {
				jshintsrc: 'jshintrc',
				ignores: ['public/libs/**/*.js']
			},
			all: ['public/js/**/*.js', 'test/**/*.js', "app/**/*.js"]
		},

		less: {
			development: {
				options: {
					compress: true,
					yuicompress: true,
					optimization: 2
				},
				files: []
			}
		},

		uglify: {
			development: {
				files: {
					'build/js/admin.min.js': 'public/js/admin.js',
					'build/js/detail.min.js': 'public/js/detail.js'
				}
			}
		},

		watch: {
			jade: {
				files: ['app/views/**'],
				options: {
					livereload: true
				}
			},
			js: {
				files: ['public/js/*.js', "app/**/*.js", "config/*.js"],
				// tasks: ['jshlint'],
				options: {
					livereload: true
				}
			},
			css: {
				files: ['public/css/*.css'],
				// tasks: ['jshlint'],
				options: {
					livereload: true
				}
			}
		},

		nodemon: {
			dev: {
				options: {
					file: 'app.js',
					args: [],
					ignoreFiles: ['README.md', 'node_modules/**', '.DS_Store', '.vscode', '.git'],
					watchedExtensions: ['js'],
					watchedFolders: ['./'], // 保存后就触发，save all不触发
					debug: true,
					delayTime: 1,
					env: {
						PORT: 9000
					},
					cwd: __dirname
				}
			}
		},

		mochaTest: {
			options: {
				reporter: 'spec'
			},
			src: ['test/**/*.js']
		},

		concurrent: {
			tasks: ['nodemon', 'watch', 'uglify', 'jshint' /*, 'clean', 'copy', 'useminPrepare', 'concat', 'uglify', 'usemin'*/ ],
			options: {
				logConcurrentOutput: true
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-watch'); // 检测文件修改执行注册好的任务
	grunt.loadNpmTasks('grunt-nodemon'); // 入口文件修改后重启
	grunt.loadNpmTasks('grunt-concurrent'); // 慢任务（sass,less/ts/cs）等开发插件，优化构建时间，同时执行多个阻塞任务

	grunt.loadNpmTasks('grunt-mocha-test'); // 单元测试

	grunt.loadNpmTasks('grunt-contrib-jshint'); // js检查插件
	grunt.loadNpmTasks('grunt-contrib-less'); // less编译插件

	// grunt.loadNpmTasks('grunt-contrib-clean'); // 目录清除
	// grunt.loadNpmTasks('grunt-contrib-copy'); // 文件复制
	grunt.loadNpmTasks('grunt-contrib-uglify'); // 代码压缩
	// grunt.loadNpmTasks('grunt-contrib-concat'); // 合并文件
	// grunt.loadNpmTasks('grunt-usemin'); // 文件引用替换


	grunt.option('force', true);

	grunt.registerTask('default', ['concurrent']);
	grunt.registerTask('test', ['mochaTest']);
}