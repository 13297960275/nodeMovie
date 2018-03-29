var Category = require('../models/category');

/* add category page*/
exports.addCategory = function(req, res) {
	res.render('category/category', {
		title: 'category'
	})
}

/* category list page*/
exports.getCategories = function(req, res) {
	Category.fetch(function(err, categories) {
		if (err) {
			console.log(err);
		}

		res.render('category/categoryList', {
			title: 'category list',
			categories: categories
		})
	})

}

/* add category fun*/
exports.addCategoryFun = function(req, res) {
	var _category = req.body.category;

	var category = new Category(_category);

	category.save(function(err, category) {
		if (err) {
			console.log(err);
		}

		res.redirect('/admin/category/list');
	})
}