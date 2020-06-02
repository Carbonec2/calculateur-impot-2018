var consoleLoggerObject;

$(document).ready(function() {

    bind();

    consoleLoggerObject = new ConsoleLogger($("#console"));
    
    $("#taxReturn").hide();
});

function bind() {
    $("#calculate").click(function() {
        createTableFromForm();
    });

    $("#calculate").keyup(function(e) {
        if (e.keyCode == 13) {
            createTableFromForm();
        }
    });

    $("#cotisation").keyup(function(e) {
        if (e.keyCode == 13) {
            createTableFromForm();
        }
    });

    $("#income").keyup(function(e) {
        if (e.keyCode == 13) {
            createTableFromForm();
        }
    });
}

/**
 * Obtient les informations à partir des entrées de l'usager
 **/
function getFromInput() {
    
    if(($("#income").val() === "") && ($("#cotisation").val() === "")){
        consoleLoggerObject.badNotice("Attention! Vous avez laissé les champs vides!");
        
        return null;
    }
    if(($("#income").val() === "") || ($("#cotisation").val() === "")){
        consoleLoggerObject.badNotice("Attention! Vous avez laissé un des champs vide!");
        
        return null;
    }

    var content = {
        income: parseFloat($("#income").val()),
        cotisation: parseFloat($("#cotisation").val()),
        incomeAfterCotisation: parseFloat($("#income").val()) - parseFloat($("#cotisation").val())
    };

    //On gère des avertissements ici

    if (content.income < content.cotisation) {
        //Erreur d'entrée
        consoleLoggerObject.badNotice("Erreur! Vous avez entré des données non-valides dans le calculateur. Veuillez vous assurer que la cotisation soit intérieure à votre salaire!");
    }

    if (content.cotisation > (content.income) * 0.18) {
        //Erreur de cotisation trop élevée si pas de cotisations antérieures
        consoleLoggerObject.badNotice("Attention! Vous cotisez plus de 18% de votre salaire! Assurez-vous d'avoir des droits de cotisation non-utilisés pour faire cette cotisation!");
    } else if (content.cotisation > 24930.0) {
        consoleLoggerObject.badNotice("Attention! Vous cotisez plus que le montant maximal permis en 2015 (24 930.00 $)!");
    }else{
        consoleLoggerObject.goodNotice("Retour d'impôt calculé avec succès.");
    }

    return content;
}

function createTableFromForm() {

    var formInput = getFromInput();
    
    if(formInput === null){
        return;
    }

    var personalObject = {
        amount: formInput.income,
        afterCotisation: false
    };

    appendTaxTable($("#tableBeforeCotisation"), personalObject, "Taux d'imposition avant la cotisation REER");

    var personalObjectAfterCotisation = {
        amount: formInput.incomeAfterCotisation,
        afterCotisation: true
    };

    appendTaxTable($("#tableAfterCotisation"), personalObjectAfterCotisation, "Taux d'imposition après la cotisation REER");
    
    var taxAmount = calculateTaxAmount(formInput.income);
    var taxAmountAfterCotisation = calculateTaxAmount(formInput.incomeAfterCotisation);
    
    $("#taxReturnField").html((parseFloat(taxAmount.totalTaxAmount) - parseFloat(taxAmountAfterCotisation.totalTaxAmount)).toFixed(2) + ' $');
    
    $("#taxReturn").show();
}

function appendTaxTable(container, personalObject, tableCaption) {

    if (typeof(container) === "undefined") {
        return;
    }

    container.empty();

    var table = $('<table class="taxTable"></table>');
	
	if(typeof(tableCaption) !== "undefined"){
		var caption = $('<caption>'+tableCaption+'</caption>');
		table.append(caption);
	}

    //Titre
    var title = $('<thead></thead>');
    title.append('<tr><th>Revenu imposable</th><th>Impôt fédéral</th><th>Impôt Québec</th><th>Impôt total</th><th>Taux effectif</th><th>Taux marginal fédéral</th><th>Taux marginal provincial</th><th>Taux marginal total</th></tr>');

    table.append(title);
    table.append(taxTableRowFromRates(personalObject));

    container.append(table);
}

function taxTableRowFromRates(personalObject) {

    var parameters = {
        personalObject: personalObject,
        tree: true
    };

    var totalRates = buildTotalRates(parameters);

    var tableBody = $('<thead></thead>');

    console.log(totalRates);

    totalRates.forEach(function(entry) {

        var taxObject = calculateTaxAmount(entry.amount);

        var tableLine = $('<tr></tr>');

        if (typeof(entry.afterCotisation) !== "undefined") {

            if (entry.afterCotisation === true) {
                tableLine.css("backgroundColor", "green");
            }
            else {
                tableLine.css("backgroundColor", "red");
            }
        }

        tableLine.append('<td>' + taxObject.income + ' $</td>');
        tableLine.append('<td>' + taxObject.federalTaxAmount + ' $</td>');
        tableLine.append('<td>' + taxObject.provincialTaxAmount + ' $</td>');
        tableLine.append('<td>' + taxObject.totalTaxAmount + ' $</td>');
        tableLine.append('<td>' + taxObject.effectiveRate + ' %</td>');
        tableLine.append('<td>' + taxObject.federalMarginalRate + ' %</td>');
        tableLine.append('<td>' + taxObject.provincialMarginalRate + ' %</td>');
        tableLine.append('<td>' + taxObject.totalMarginalRate + ' %</td>');

        tableBody.append(tableLine);

    });

    return tableBody;

}