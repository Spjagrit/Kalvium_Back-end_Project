const express = require('express');
const math = require('mathjs');
const app = express();
const port = 3000;
// Define operator and operand mappings
const operators = {
    minus: '-',
    into: '*',
    divide: '/',
    square: '**',
    plus: '+'
};
const history=[];
app.get('/history', (req, res) => {
    // HTML for displaying history
    const historyHtml = `
      <h1>History of Operations:</h1>
      <ul>
        ${history.map(entry => `<li>${entry.question}: ${entry.answer}</li>`).join('')}
      </ul>
    `;
    res.send(historyHtml);
});
app.get('/', (req, res) => {
    // HTML for listing available endpoints
    const html = `
      <h1>Available Endpoints:</h1>
      <ul>
        <li><a href="/history" target="_blank">/history</a> - View history of operations</li>
        <li><a href="/calculate/3/minus/4/plus/3" target="_blank"> /calculate/:expression </a>
         Demo endpoint to perform calculation (3-4+3) ==> http://localhost:3000/calculate/3/minus/4/plus/3  (This is the sequence you need to follow to carry mathematical operations)    
        </li>
      </ul>
    `;
    res.send(html);
});

function calcExpressionValue(parts) {
    // Initialize the result with the first operand
    let result = parseFloat(parts[0]);

    // Iterate over the remaining parts
    for (let i = 1; i < parts.length; i += 2) {
        const operator = operators[parts[i]];
        const operand = parseFloat(parts[i + 1]);

        switch (operator) {
            case '-':
                result -= operand;
                break;
            case '+':
                result+= operand;
                break;
            case '*':
                result *= operand;
                break;
            case '/':
                result /= operand;
                break;
            case '**':
                result **= operand;
                break;
            default:
                console.log(`Unknown operator: ${operator}`);
        }
    }
    return result;
}

function calcQuestionExpression(paramsExpression) {
    let result = '';

    // Iterate over the remaining parts
    for (let i = 1; i < paramsExpression.length; i += 2) {
        result += paramsExpression[i - 1];
        const operator = operators[paramsExpression[i]];
        switch (operator) {
            case '-':
                result += '-';
                break;
            case '+':
                result += '+';
                break;
            case '*':
                result += '*';
                break;
            case '/':
                result += '/';
                break;
            case '**':
                result += '**';
                break;
            default:
                console.log(`Unknown operator: ${operator}`);
        }
    }
    result += paramsExpression[paramsExpression.length - 1]

    console.log('This is the question expression =>' ,result )
    return result;

}
app.get('/calculate/:expression*', (req, res) => {
    let {expression}=req.params;
    expression+=req.params["0"];
    const parts = expression.split('/');
    console.log('parts', parts);
    const questionExpressionValue  = calcQuestionExpression(parts);
    console.log(math.evaluate(questionExpressionValue));
    

    const jsonExpression = {
        question:questionExpressionValue ,
        answer: math.evaluate(questionExpressionValue)
    }
    history.unshift(jsonExpression);
    if (history.length > 20) {
      history.pop();
    }
    res.json(jsonExpression);
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });

