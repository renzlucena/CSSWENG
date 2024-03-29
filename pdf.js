var Pdfmake = require('pdfmake');
var fs = require('fs');
var fonts = {
    Roboto: {
        normal: 'pdfmake/build/fonts/roboto/Roboto-Regular.ttf',
        bold: 'pdfmake/build/fonts/roboto/Roboto-Medium.ttf',
        italics: 'pdfmake/build/fonts/roboto/Roboto-Italic.ttf',
        bolditalics: 'pdfmake/build/fonts/roboto/Roboto-MediumItalic.ttf'
    }
};

let pdfmake = new Pdfmake(fonts);
  
var docDefinition = {
    pageSize: 'LETTER',
    pageMargins: [80, 60],
    header: function(currpage){
        if (currpage != 1){
            return [{
                columns: [
                    {
                        width: '*',
                        text: 'Appraisal of Real Property for Kind of Lot', alignment: 'left', margin: [80, 20]
                    }, 
                    {
                        width: '40',
                        text: currpage.toString(), alignment: 'right', margin: [80, 20]
                    }
                ],
            }]
        }
    },
    content: [
        {text: '\n\n\n\nAppraisal of Real Estate \nFor', style: 'title'},
        {text: '$Kind of Lot\n\n', style: 'title', color: 'green'},
        {canvas: [
            {
                type: 'line',
                x1: 40, y1: -15,
                x2: 400, y2: -15,
                lineWidth: 1
            }
        ]},
        {text: 'Kamagong Street \nRidgewood, Ayala Westgrove Heights, Silang Cavite\n\n\n\n\n', style: 'titletext'},
        {text: 'As Of: \nMay 5, 2021\n\n\n\n\n', style: 'h1'},
        {text: 'Prepared for \nXXX Enterprises Unlimited, Inc. \nPaseo De Roxas, Makati\n\n\n\n\n', style: 'h1'},
        {text: 'Prepared By\n', style: 'h1'},
        {text: 'Ma. Cristina D. Ventucillo, REA Lic. No. 10728 \nTaft Avenue, Pasay City', style: 'titletext', 
        pageBreak: 'after'},

        {text: '\n\nTransmittal Letter\n\n\n', style: 'h2'},
        {columns: [
        {
            text: 'Mr. XXX XXX \nXXX Enterprises Unlimited, Inc.'
        }, 
        {
            text: 'May 8, 2021 \n\nRe: Summary Appraisal Report \nVacant Land - 406 sqm \nAyala Westgrove Heights, \nBrgy. Carmen, Silang Cavite'
        }
        ]},  
        {text: '\n\n\nDear Mr. XXX,\n\n'},
        {text: 'In accordance with your request, I have made an investigation and appraisal of the above captioned property for the purpose of estimating the Market Value in the Fee Simple Interest. The effective date of the appraisal is May 5, 2021.'},
        {text: '\n\nSubmitted here with is my report containing facts and data gathered.\n\n'}, 
        {text: 'The method of appraising is detailed in the attached narrative report as of May 5, 2021. It is my opinion that the Market Value with Fee Simple Interest in the subject property, subject to the attached limiting conditions, is”'},
        {text: '\n\nTwelve Million Seven Hundred Eighty Nine Thousand Pesos (Php12,789,000.00)', style: 'appraisalval'},
        {text: '\n\nIt has been a pleasure to serve you in this matter\n\n\n\n'}, 
        {text: 'Respectfully submitted,\n\n\n\n', margin: [0, 0, 5, 5], alignment: 'right'},
        {text: 'Ma. Cristina D. Ventucillo,', margin: [0, 0, 5, 0], alignment: 'right'},
        {text: 'Certified Real Estate Appraiser # 10728', margin: [0, 0, 5, 0], alignment: 'right', pageBreak: 'after'},

        {text: 'Appraisal Summary\n\n\n', style: 'h2'},
        {table: {
            heights: 40,
            widths: ['*', '*'],
            body: [
                ['Intended User of Appraisal:', 'XXX Enterprises Unlimited, Inc.'],
				['Property Type:', 'Vacant Land'], 
                ['Property Address:', 'Phase 6 Block 6 Lot 30 West Grove Heights Brgy. Carmen, Municipality of Silang, Cavite'],
                ['Parcel ID:', 'TCT No. 48390'],
                ['Owner: ', 'XXX Enterprises Unlimited, Inc.'], 
                ['Land Size: ', '406 square meters'],
                ['Improvements: ', 'None'],
                ['Zoning Classification:', 'RR - Residential Regular'],
                ['Interest Appraised:', 'Fee Simple'],
                ['Effective Date of Appraisal:', 'May 5, 2021'],
                ['Date of Report:', 'May 8, 2021'],
                ['Final Estimate of Value:', 'Php12,789,000.00']
            ]
            }, 
            layout: 'noBorders',
            pageBreak: 'after'
        },

        {text: 'Assumptions and Limiting Conditions\n\n', style: 'h2'},
        {text: 'The appraisal is made subject to the following conditions and assumptions\n\n'},
        {ol: [
            'Any legal description or plans reported herein are assumed to be accurate. Any drawings attached to assist the reader in visualizing the property. I have made no survey of the property and assume no responsibility in connection with such matters.\n\n',
            'No responsibility is assumed for matters legal in nature. Title is assumed to be good and marketable and in fee simple. The property is appraised as free and clear of existing liens and encumbrances.\n\n',
            'No soil analysis or geological studies were made in conjunction with this report.\n\n',
            'It is assumed that there are no encroachments, zoning or restriction violations affecting the subject property.\n\n',
            'The property is assumed to be under competent and aggressive management.\n\n',
            'Information, estimates, and opinion used in this appraisal are obtained from sources considered reliable; however, no liability for them can be assumed by the appraiser.\n\n',
            'The value estimates reported herein apply to the entire property and any proration or division of the total into fractional interests will invalidate the value estimate.\n\n',
            'This report may not be used for any purpose other than as stated in the report, by anyone other than the client without prior consent of the appraiser.\n\n',
            'Neither all nor any part of the contents of this report shall be conveyed to the public through advertising, public relations, news, sales, or other media, without the prior written consent and approval of the appraiser. This pertains particularly to valuation conclusions, the identity of the appraiser, or firm with which she is associated.\n\n',
            'The final value estimate has been concluded on the basis that property is environmentally compliant. Further, the land area was based on information provided by the owner and/or public records. If the actual land area is different from the area used in this report, the appraiser reserves the right to modify this report.\n\n', 
            'The final value estimate has been concluded on the basis that the property is not subject to flooding nor within fault range. A certified survey is recommended.\n\n',
            'Any erasure on appraisal date and values invalidates this report.\n\n',
            'The appraisal report is invalid unless it bears the signature of the appraiser and conformity of client.'
        ], pageBreak: 'after'},

        {text: "Appraiser's Certification\n\n", style: 'h2'},
        {text: 'I certify, to the best of my knowledge and belief:\n\n'},
        {ol: [
            'That statements of facts contained in this report are true and correct.\n\n',
            'That I have diligently used all possible means of verifying the physical character, location and kind of neighborhood of the subject property and the comparables that are available given the travel restrictions imposed by the Inter-Agency Task Force on Emerging Infectious Diseases (IATF)\n\n', 
            'That I have taken into consideration factors which may affect its value and the highest and best use of the property\n\n', 
            'That the reported analyses, opinions, and conclusions in this report are limited only by the assumptions and limiting conditions stated in this report, and are my personal, unbiased professional analyses, opinions, and conclusions.\n\n',
            'That I have no present nor contemplated future interest in the subject property.\n\n',
            'That my compensation is not contingent upon the reporting of a predetermined value\n\n', 
            'That my analyses, opinions, and conclusions were developed, and this report was prepared in conformity with the Philippine Valuation Standards and the Code of Conducts for real estate appraisers.\n\n\n\n\n\n\n\n'
        ]},
        {canvas: [
            {
                type: 'line',
                x1: 250, y1: -10,
                x2: 450, y2: -10,
                lineWidth: 1
            }
        ]},
        {text: 'Ma. Cristina D. Ventucillo - REA #10728', alignment: 'right', pageBreak: 'after'},

        {text: 'Assignment Description\n', style: 'h2'},
        {text: 'A. Property Identification\n\n', style: 'h3'},
        {text: '\t\t\tLorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam.', preserveLeadingSpaces: true},
        {text: '\nAppraisal objective and property rights\n\n', style: 'h3'},
        {text: '\t\t\tLorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam.', preserveLeadingSpaces: true},
        {text: '\nIntended use and intended users\n\n', style: 'h3'},
        {text: '\t\t\tLorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam.', preserveLeadingSpaces: true},
        {text: '\nEffective Date of Appraisal/Report Date\n\n', style: 'h3'},
        {text: '\t\t\tLorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam.', preserveLeadingSpaces: true},
        {text: '\nStatement of ownership and sales history\n\n', style: 'h3'},
        {text: '\t\t\tLorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam.', preserveLeadingSpaces: true, pageBreak: 'after'},

        {text: 'B. Scope of Work\n\n', style: 'h3'},
        {text: '\t\t\tLorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam.\n\n', preserveLeadingSpaces: true},
        {text: '\t\t\tLorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam.' + 
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam.\n\n', preserveLeadingSpaces: true},
        {text: '\t\t\tLorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam.' + 
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam.\n\n', preserveLeadingSpaces: true},
        {text: '\t\t\tLorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam.' + 
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam.\n\n', preserveLeadingSpaces: true},
        {text: '\t\t\tLorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam.\n\n', preserveLeadingSpaces: true, pageBreak: 'after'},

        {text: 'Property Description\n\n', style: 'h2'},
        {text: 'A. Description of Lot.\n\n', style:'h3'},
        {table: {
            heights: 40,
            widths: ['*', '*'],
            body: [
                ['Title No.:', 'TCT No. 48390'],
                ['Location:', 'Phase 6 Block 6 Lot 30 West Grove Heights Brgy. Carmen, Municipality of Silang, Cavite'],
                ['Property Type:', 'Vacant Land'],
                ['Land Area: ', '406 square meters'],
                ['Shape: ', 'A corner lot with regular shape'],
                ['Frontage:', '13.08 meters facing Kamagong Street plus 4.39 meter corner arc'],
                ['Topography::', 'Flat Terrain'],
                ['Utilities:', 'Electricity and water ready for application'],
                ['Environmental: ', 'There were no visible signs of environmental hazards. This report assumes that there are no environmental hazards present that would impact the value of the subject property.'],
                ['Flood:', 'The property is located on a higher ground than most of the neighboring lots.'],
                ['Easements:', "No visible easements that would lessen the subject's value"],
                ['Real Estate Taxes:', 'The subject with TCT No. 48390 has no outstanding unpaid real property tax. Based on the value conclusion in this report, the subject is properly assessed for tax purposes.'],
                ['Zoning:', 'The subject site is zoned RR - Residential Regular.']
            ]
            }, 
            layout: 'noBorders',
            pageBreak: 'after'
        },

        {text: 'B. Description of Improvements.\n\n', style:'h3'},
        {text: '\t\t\tLorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam.' +
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam.' + 
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam.' + 
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam.\n\n', preserveLeadingSpaces: true},

        {text: 'C. Location\n\n', style:'h3'},
        {text: '\t\t\tLorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam.' +
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam.' + 
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam.' + 
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam.\n\n', preserveLeadingSpaces: true, pageBreak: 'after'},

        {text: 'Area and Neighborhood Overview\n\n', style: 'h2'},
        {text: '\t\t\tThe purpose of this analysis is to review historic and projected economic data to ' +
        'determine whether Ayala Westgrove Heights and the subject neighborhood will experience ' +
        'future economic stability, or decline, given the current pandemic situation worldwide.\n\n\n', preserveLeadingSpaces: true,},
        {text: 'A. Area Development.\n\n', style: 'h3'},
        {text: '\t\t\tLorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam.' +
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam.' + 
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam.' + 
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam.\n\n', preserveLeadingSpaces: true},
        {text: '\t\t\tLorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam.' +
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam.' + 
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam.' + 
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam.\n\n', preserveLeadingSpaces: true, pageBreak: 'after'},

        {text: 'B. Market Analysis\n\n', style: 'h3'},
        {text: '\t\t\tLorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam.' +
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam.' + 
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam.' + 
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam.\n\n', preserveLeadingSpaces: true},
        {text: '\t\t\tLorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam.' +
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam.' + 
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam.' + 
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam.\n\n', preserveLeadingSpaces: true},
        {text: '\t\t\tLorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam.' +
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam.' + 
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam.' + 
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam.\n\n', preserveLeadingSpaces: true, pageBreak: 'after'},

        {text: 'Valuation\n\n', style: 'h2'},
        {text: 'A. Highest and Best Use\n\n', style: 'h3'},
        {text: '\t\t\tLorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam.' +
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam.' + 
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam.' + 
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam.\n\n', preserveLeadingSpaces: true},
        {text: 'Legally Permissible\n\n', style: 'h3'},
        {text: '\t\t\tLorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam.' +
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam.' + 
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam.' + 
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam.\n\n', preserveLeadingSpaces: true},
        {text: 'Physical Possibility\n\n', style: 'h3'},
        {text: '\t\t\tLorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam.' +
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam.' + 
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam.' + 
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam.\n\n', preserveLeadingSpaces: true, pageBreak: 'after'},

        {text: 'Financial Feasibility\n\n', style: 'h3'},
        {text: '\t\t\tLorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam.' +
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam.' + 
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam.' + 
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam.\n\n', preserveLeadingSpaces: true},
        {text: 'Maximum Productivity\n\n', style: 'h3'},
        {text: '\t\t\tLorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam.' +
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam.' + 
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam.' + 
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam.\n\n', preserveLeadingSpaces: true},
        {text: 'Conclusion\n\n', style: 'h3'},
        {text: '\t\t\tLorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam.' +
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam.' + 
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam.' + 
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam.\n\n', preserveLeadingSpaces: true, pageBreak: 'after'},

        {text: 'B. The Valuation Process\n\n', style: 'h3'},
        {text: '\t\t\tLorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam.' +
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam.' + 
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam.' + 
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam.\n\n', preserveLeadingSpaces: true},
        {text: 'Market Data Approach.\n\n', style: 'h3'},
        {text: '\t\t\tLorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam.' +
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam.' + 
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam.' + 
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam.\n\n', preserveLeadingSpaces: true},
        {text: "Comparables'\n\n", style: 'h3'},
        {text: '\t\t\tLorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam.' +
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam.' + 
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam.' + 
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam.\n\n', preserveLeadingSpaces: true, pageBreak: 'after'},

        {text: 'C. Explanation of Adjustments\n\n', style: 'h3'},
        {text: '\t\t\tLorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam.' +
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam.' + 
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam.' + 
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam.\n\n', preserveLeadingSpaces: true},
        {text: "Value Indications'\n\n", style: 'h3'},
        {table: {
            heights: 40,
            widths: ['*', 'auto'],
            headerRows: 1,
            body: [
                ['Value Indications', 'Value per sqm.'],
				['Range', '28,320 - 34,500'], 
                ['Final Value Indication', '31,500 per sqm'],
            ]
            }, 
            layout: {
				fillColor: function (rowIndex) {
					return (rowIndex % 2 === 0) ? '#CCCCCC' : null;
				}
            },
            pageBreak: 'after',
        },

        {text: 'Reconciliation and Final Value Opinion\n\n', style: 'h2'},
        {text: '\t\t\tLorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam.\n\n', preserveLeadingSpaces: true},
        {table: {
            heights: 40,
            widths: ['*', 'auto', 'auto'],
            headerRows: 1,
            body: [
                ['Approaches to Value', 'Value', 'Value per sqm'],
				['Market Data Approach', 'Php12,789,000.00', '31,500 per sqm'], 
                ['Cost Approach', 'n/a', 'n/a'],
                ['Income Capitalization Approach', 'n/a', 'n/a'],
                ['Final Value Indication', 'Php12,789,000.00 ', '31,500 per sqm'],
            ]
            }, 
            layout: {
				fillColor: function (rowIndex) {
					return (rowIndex % 2 === 0) ? '#CCCCCC' : null;
				},
            pageBreak: 'after',
            }
        },
        {text: '\n\n\t\t\tBased on the investigation of the subject property and the analysis of all relevant data, the Fee Simple Market Value of the subject property, as of May 5, 2021, is:\n\n\n', preserveLeadingSpaces: true},
        {text: 'Pesos: Twelve Million Seven Hundred Eighty Nine Thousand\n(Php12,789,000.00)', style: 'appraisalval'}
    ],
    defaultStyle:{
        fontSize: 11,
        alignment: 'justify'
    },
    styles:{
        title: {
            fontSize: 18,
            bold: true,
            alignment: 'center'
        },
        h1: {
            fontSize: 16,
            alignment: 'center'
        },
        h2: {
            fontSize: 14,
            bold: true,
            alignment: 'center'
        },
        h3: {
            fontSize: 12,
            bold: true,
        },
        titletext: {
            alignment: 'center'
        },
        appraisalval: {
            fontSize: 14,
            alignment: 'center',
            color: 'green'
        }
    }
};
  
let pdf = pdfmake.createPdfKitDocument(docDefinition, {});
pdf.pipe(fs.createWriteStream('document.pdf'));
pdf.end();