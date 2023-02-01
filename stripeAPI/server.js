// This is your test secret API key.
const stripe = require('stripe')('sk_test_51MOzgsDje7TaFP6ifEv0538HeUy785gg7ljaJrVtuINjumcwGBestXe528KrnvnWcr70jkXv7sKQVzYdklVCjddG00naWk05tS');
const express = require('express');
const bodyparser = require("body-parser")
const cors = require("cors")
const app = express();
app.use(express.static('public'));
app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())
app.use(cors({origin:true,credentials:true}))

const YOUR_DOMAIN = 'http://localhost:4242';

app.post('/checkout', async (req, res) => {
	console.log(req.body);
  const session = await stripe.checkout.sessions.create({
    line_items:req.body.items.map(i=>
    ({
        price_data: {currency: 'usd', product_data: {name:i.product.name,images:[i.product.thumbnail]}, unit_amount: i.product.price*100},
        quantity: i.quantity,
    })
  ),
    mode: 'payment',
    success_url: `http://localhost:4200/store/checkout?seccus=true&token=${req.body.token}`,
    cancel_url: `http://localhost:4200/store/checkout?seccus=false&token=${req.body.token}`,
  });
  // console.log(session)
  // res.redirect(303, session.url);
  res.status(200).json(session)
});

app.listen(4242, () => console.log('Running on port 4242'));