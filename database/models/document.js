//schema for editDocument
const mongoose =	require('mongoose')

const documentSchema = new mongoose.Schema({
	ref_id: Number,
	filename: String,
    company_name: String,
    company_address: String,
    appraisal_date: {type: Date, required: true, default: Date.now},
    appraiser_num: Number,
    appraiser_address: String,
    market_value: String,
    parcel_id: String,
    improvements: String,
    zoning_class: String,
    interest_appraised: String,

    //Start of Body of Document
    property_identification: String,
    //property_images: [imageSchema],
    appraisal_objective_property_rights: String,
    intended_use_intended_users: String,
    effective_date_report: String,
    statement_ownership_sales_history: String,
    scope_of_work: String,

    //property description
    title_no: String, 
    utilities: String,
    flood: String,
    easements: String,
    real_estate_taxes: String,
    zoning_desc: String,

    //area & neighborhood overview
    description_improvements: String,
    neighborhood: String,
    area_development: String,
    market_analysis: String,

    //valuation
    highest_best_use: String,
    legally_permissible: String,
    physical_possibility: String,
    financial_feasibility: String,
    maximum_productivity: String,
    conclusion: String,
    valuation_process: String,
    market_data_approach: String,
    //comparables: ,
    explanation_adjustments: String,
    range_value_per_sqm: String,
    final_value_per_sqm: String,

    //reconciliation & final value opinion
    recon_final_value_opinion: String,
    market_value: String,
    market_value_per_sqm: String,
    cost_value: String,
    cost_value_per_sqm: String,
    income_value: String,
    income_value_per_sqm: String,
    final_value_indication: String,
    final_value_indication_per_sqm: String,

    //comparatives
    /*subject: comparativeSchema,
    comp1: comparativeSchema,
    comp2: comparativeSchema,*/
    comment: {type:String, default:"New!"}
})

const Document = mongoose.model('Document', documentSchema);

module.exports = Document;