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
				files: ['public/js/**', 'models/**/*.js', "schemas/**/*.js"],
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
					watchedFolders: ['app', 'config'],
					debug: true,
					delayTime: 1,
					env: {
						PORT: 9000
					},
					cwd: __dirname
				}
			}
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

	grunt.option('force', true);

	grunt.registerTask('default', ['concurrent']);
}