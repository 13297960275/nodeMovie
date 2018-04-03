module.exports = function(grunt) {
	grunt.initConfig({
		watch: {
			jade: {
				files: ['views/**'],
				options: {
					livereload: true
				}
			},
			js: {
				files: ['public/js/**/*.js', , 'models/**/*.js', "schemas/**/*.js"],
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
			tasks: ['nodemon', 'watch'],
			options: {
				logConcurrentOutput: true
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-watch'); // 检测文件修改执行注册好的任务
	grunt.loadNpmTasks('grunt-nodemon'); // 入口文件修改后重启
	grunt.loadNpmTasks('grunt-concurrent'); // 慢任务（sass,less/ts/cs）等开发插件，优化构建时间，同时执行多个阻塞任务
	grunt.loadNpmTasks('grunt-mocha-test'); // 单元测试

	grunt.option('force', true);

	grunt.registerTask('default', ['concurrent']);
	grunt.registerTask('default', ['mochaTest']);
}