var totalRatesWithoutPersonal = buildTotalRates({
    tree: false
}, true);

function buildProvincialRates() {

    var provincialRates = [{
        rate: 0.1500,
        amount: 15012,
        provincial: 1
    }, {
        rate: 0.2000,
        amount: 43055,
        provincial: 1
    }, {
        rate: 0.2400,
        amount: 86106,
        provincial: 1
    }, {
        rate: 0.2575,
        amount: 104766,
        provincial: 1
    }];

    return provincialRates;
}

function buildFederalRates() {

    var federalRates = [{
        rate: 0.1252,
        amount: 11809,
        federal: 1
    }, {
        rate: 0.1837,
        amount: 46606,
        federal: 1
    }, {
        rate: 0.2171,
        amount: 93209,
        federal: 1
    }, {
        rate: 0.2422,
        amount: 144490,
        federal: 1
    }, {
        rate: 0.2756,
        amount: 205843,
        federal: 1
    }];

    return federalRates;
}

function buildTreeRates() {

    var treeRates = [{
            amount: 5000
        }, {
            amount: 10000
        }, {
            amount: 15000
        }, {
            amount: 20000
        }, {
            amount: 25000
        }, {
            amount: 30000
        }, {
            amount: 35000
        }, {
            amount: 45000
        }, {
            amount: 50000
        }, {
            amount: 55000
        }, {
            amount: 60000
        }, {
            amount: 70000
        }, {
            amount: 95000
        }, {
            amount: 100000
        }, {
            amount: 150000
        }, {
            amount: 200000
        }, {
            amount: 250000
        }
    ];

    return treeRates;
}

//On transforme l'objet en array pour faire la concaténation
function buildPersonalRate(personal) {
    var personalRate = [];

    var content = {
        amount: personal.amount,
        afterCotisation: personal.afterCotisation
    };

    personalRate.push(content);

    return personalRate;
}

function buildTotalRates(parameters, invert) {

    var totalRates = []; //On créé la variable localement, et elle est utilisée seulement pour être retournée, avec ou sans les taux d'imposition de l'individu

    var federalRates = buildFederalRates();

    totalRates = federalRates.concat(buildProvincialRates());

    if (typeof(parameters.personalObject) !== "undefined") {
        console.log(parameters.personalObject);

        totalRates = totalRates.concat(buildPersonalRate(parameters.personalObject));
    }

    if (parameters.tree) {
        totalRates = totalRates.concat(buildTreeRates());
    }

    if (typeof(invert) !== "undefined" && invert === true) {
        totalRates.sort(compareTaxAmountInvert);
    }
    else {
        totalRates.sort(compareTaxAmount);
    }

    return totalRates;
}

function compareTaxAmount(a, b) {
    //Du plus petit au plus gros
    if (a.amount < b.amount)
        return -1;
    if (a.amount > b.amount)
        return 1;
    return 0;
}

function compareTaxAmountInvert(a, b) {
    //Du plus gros au plus petit
    if (a.amount > b.amount) //<
        return -1;
    if (a.amount < b.amount) // >
        return 1;
    return 0;
}

function calculateTaxAmount(amount) {

    var federalRemainingAmount = amount;
    var provincialRemainingAmount = amount;
    var federalTaxAmount = 0;
    var federalMarginalRate = 0;
    var provincialTaxAmount = 0;
    var provincialMarginalRate = 0;

    var totalRates = totalRatesWithoutPersonal;

    totalRates.forEach(function(entry) {
        if (entry.federal === 1) {
            //On dois faire le calcul sur le montant fédéral
            if (federalRemainingAmount >= entry.amount) {
                //Donc on a un revenu au-dessus du taux marginal
                if (federalMarginalRate === 0) {
                    //On indique le taux marginal s'il n'a pas été créé avant
                    federalMarginalRate = entry.rate;
                }

                federalTaxAmount += (federalRemainingAmount - entry.amount) * entry.rate;

                federalRemainingAmount = entry.amount;
            }
        }
        if (entry.provincial === 1) {
            //On dois faire le calcul sur le montant fédéral
            if (provincialRemainingAmount >= entry.amount) {
                //Donc on a un revenu au-dessus du taux marginal
                if (provincialMarginalRate === 0) {
                    //On indique le taux marginal s'il n'a pas été créé avant
                    provincialMarginalRate = entry.rate;
                }

                provincialTaxAmount += (provincialRemainingAmount - entry.amount) * entry.rate;

                provincialRemainingAmount = entry.amount;
            }
        }
    });

    var content = {
        income: amount.toFixed(2),
        federalTaxAmount: (federalTaxAmount).toFixed(2),
        provincialTaxAmount: (provincialTaxAmount).toFixed(2),
        totalTaxAmount: (provincialTaxAmount + federalTaxAmount).toFixed(2),
        effectiveRate: (amount === 0 ? '0.00' : (((provincialTaxAmount + federalTaxAmount) * 100) / amount).toFixed(2)),
        federalMarginalRate: (federalMarginalRate * 100).toFixed(2),
        provincialMarginalRate: (provincialMarginalRate * 100).toFixed(2),
        totalMarginalRate: ((federalMarginalRate * 100) + (provincialMarginalRate * 100)).toFixed(2)
    };

    return content;
}