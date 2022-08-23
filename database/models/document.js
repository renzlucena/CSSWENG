//schema for editDocument
const mongoose =	require('mongoose')

const documentSchema = new mongoose.Schema({
	ref_id: Number,
	filename: String,
    //client_name: String, //client name
    //company_address: String, //get from assignment
    //appraisal_date: {type: Date, required: true, default: Date.now}, remove
    //appraiser_num: Number, remove
    //appraiser_address: String, //should be on the agent
    //market_value: String, //final computation
    //parcel_id: String, //assignment
    improvements: String,
    zoning_classification: String, 
    //interest_appraised: String, //assignment

    //Start of Body of Document
    property_identification: String,
    //property_images: [imageSchema],
    appraisal_objective_property_rights: String,
    intended_use_intended_users: String,
    effective_date_report: String,
    statement_ownership_sales_history: String,
    scope_of_work: String,

    //property description
    //title_no: String, //use instead of parcel_id
    utilities: String,
    flood: String,
    easements: String,
    real_estate_taxes: String,
    //zoning_desc: String, //same as zoning classification

    //area & neighborhood overview
    description_improvements: String,
    //neighborhood: String, remove
    area_development: String,
    market_analysis: String,

    //valuation remove from edit copy it from the report
    //highest_best_use: String,
    //legal_permissibility: String,
    //physical_possibility: String,
    //financial_feasibility: String,
    //maximum_productivity: String,
    //conclusion: String,
    //valuation_process: String,
    //market_data_approach: String,

    explanation_adjustments: String,
    //range_value_per_sqm: String, //from lowest to highest comparable
    //final_value_per_sqm: String, //get from assignment computation

    //reconciliation & final value opinion
    recon_final_value_opinion: String,
    //market_value: String, remove
    //market_value_per_sqm: String, remove
    //final_value_indication: String, //remove, in peso value round up to nearest hundred value
    //final_value_indication_per_sqm: String, //remove , round up to nearest hundred value

    //comparatives
    /*subject: comparativeSchema,
    comp1: comparativeSchema,
    comp2: comparativeSchema,*/
    comment: {type:String, default:"New!"}
})

const Document = mongoose.model('Document', documentSchema);

module.exports = Document;