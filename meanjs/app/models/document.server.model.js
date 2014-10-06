'use strict';

/**
*Module Dependencies
*/
var mongoose = require('mongoose'),
Schema = mongoose.Schema,
crypto = require('crypto');

/**
* Document Schema
*/
var DocumentSchema = new Schema({
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
	gradingScale: {
		type: Number
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