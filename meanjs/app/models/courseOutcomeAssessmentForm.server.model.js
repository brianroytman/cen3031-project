'use strict';

/**
*Module Dependencies
*/
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
* CourseOutcomeAssessmentForm Schema
*/
var CourseOutcomeAssessmentFormSchema = new Schema({
	outcome: {
		type: Number,
		default: 0
	},
	description: {
		type: String,
		trim: true,
		default: ''
	},
	courseNumber: {
		type: Number
	},
	term: {
		type: String,
		trim: true,
		default: ''
	},
	courseTitle: {
		type: String,
		trim: true,
		default: ''
	},
	/*
		This might need to be its own small schema and then we would nest it.
	*/
	instructor: {
		type: String,
		trim: true,
		default: ''
	},
	date: {
		type: Date,
		trim: true,
		default: Date.now
	},
	descriptionOfInstrument: {
		type: String,
		trim: true,
		default: ''
	},
	numberOfStudents: {
		type: Number
	},
	/* I think this needs to be a string. e.g. 0-10 or 0-100 */
	gradingScale: {
		type: String,
		trim: true,
		default: '0-10'
	},
	averageScore: {
		type: Number
	},
	scoreForAdequateOutcomeAchievement: {
		type: Number
	},
	percentOfStudentsAchievingOutcomeAdequately: {
		type: Number
	},
	averageLikertScaleValue: {
		type: Number
	},
	instructorComments: {
		type: String,
		trim: true,
		default: ''
	}
});

mongoose.model('CourseOutcomeAssessmentForm', CourseOutcomeAssessmentFormSchema);