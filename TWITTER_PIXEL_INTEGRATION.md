<!DOCTYPE html>
<html lang="en">
<head>
    <script>
!function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments);
},s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='https://static.ads-twitter.com/uwt.js',
a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script');
twq('config','q5wia');
</script>

    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Premium Banking Cards</title>
    <style>
        :root {
            --primary-color: #3a3a3a;
            --accent-color: #f3a046;
            --hover-color: #e08b2c;
            --white: #ffffff;
            --light-gray: #f8f8f8;
            --medium-gray: #e0e0e0;
            --dark-gray: #505050;
            --box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
            --recommended-shadow: 0 20px 40px rgba(243, 160, 70, 0.2);
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', 'Roboto', sans-serif;
        }

        body {
            background-color: var(--light-gray);
            color: var(--primary-color);
            line-height: 1.6;
        }

        .container {
            max-width: 1400px;
            margin: 50px auto;
            padding: 0 20px;
        }

        .section-title {
            text-align: center;
            margin-bottom: 50px;
        }

        .section-title h2 {
            font-size: 36px;
            font-weight: 700;
            margin-bottom: 10px;
        }

        .section-title p {
            font-size: 18px;
            color: var(--dark-gray);
            max-width: 700px;
            margin: 0 auto;
        }

        .cards-container {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
            justify-content: center;
            align-items: start;
        }

        /* Responsive design for smaller screens */
        @media (max-width: 1200px) {
            .cards-container {
                grid-template-columns: repeat(2, 1fr);
                gap: 25px;
            }
        }

        @media (max-width: 768px) {
            .cards-container {
                grid-template-columns: 1fr;
                gap: 30px;
            }
        }

        .card {
            background-color: var(--white);
            border-radius: 16px;
            overflow: hidden;
            box-shadow: var(--box-shadow);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            position: relative;
            display: flex;
            flex-direction: column;
            height: 100%;
            min-height: 600px;
        }

        .card:hover {
            transform: translateY(-10px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .card-recommended {
            transform: scale(1.02);
            box-shadow: var(--recommended-shadow);
            border: 2px solid var(--accent-color);
        }

        .card-recommended:hover {
            transform: scale(1.02) translateY(-10px);
        }

        .recommended-badge {
            position: absolute;
            top: -8px;
            right: 20px;
            background-color: var(--accent-color);
            color: var(--white);
            padding: 8px 15px;
            border-radius: 30px;
            font-weight: 600;
            font-size: 14px;
            box-shadow: 0 5px 15px rgba(243, 160, 70, 0.3);
            z-index: 2;
            transform: translateY(0);
        }

        .card-header {
            padding: 20px;
            background-color: var(--primary-color);
            color: var(--white);
            text-align: center;
            position: relative;
        }

        .card-header h3 {
            font-size: 20px;
            font-weight: 700;
            margin-top: 12px;
            color: white;
        }

        .card-image {
            height: 180px;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #f8f8f8;
            padding: 15px;
        }

        .card-image img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            transition: transform 0.3s ease;
            aspect-ratio: 16/9;
        }

        .card:hover .card-image img {
            transform: scale(1.05);
        }

        .card-content {
            padding: 15px;
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }

        .fee-item {
            margin-bottom: 8px;
            display: flex;
            align-items: center;
        }

        .fee-item i {
            color: var(--accent-color);
            margin-right: 10px;
            font-size: 14px;
            min-width: 16px;
            text-align: center;
        }

        .fee-item-content {
            flex: 1;
        }

        .fee-label {
            font-weight: 600;
            color: var(--primary-color);
            display: inline-block;
            margin-right: 5px;
            font-size: 14px;
        }

        .fee-value {
            color: var(--dark-gray);
            display: inline-block;
            font-size: 14px;
        }

        .highlight-text {
            color: var(--accent-color);
            font-weight: 700;
        }

        .card-footer {
            padding: 15px;
            text-align: center;
            margin-top: auto;
        }

        .select-button {
            display: inline-block;
            width: 100%;
            padding: 12px 20px;
            background-color: var(--accent-color);
            color: var(--white);
            border: none;
            border-radius: 30px;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            transition: background-color 0.3s ease, transform 0.2s ease;
            text-decoration: none;
            text-align: center;
        }

        .select-button:hover {
            background-color: var(--hover-color);
            transform: translateY(-3px);
        }
        
        .monthly-cap {
            font-weight: 600;
            font-size: 14px;
            margin-top: 12px;
            color: var(--primary-color);
            display: flex;
            align-items: center;
        }
        
        .monthly-cap i {
            color: var(--accent-color);
            margin-right: 10px;
            min-width: 16px;
            font-size: 14px;
            text-align: center;
        }
        
        .unlimited-cap {
            color: var(--accent-color);
        }
        .icon-size {
            font-size: 14px;
            margin-right: 12px;
        }
    </style>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
</head>
<body>
    <div class="container">
        <div class="section-title">
            <h2>Choose the BananaCrystal Card That Fits Your Lifestyle</h2>
            <p>Select the card that best suits your Find the Perfect Card for Your Spending Habits - From Everyday Use to Unlimited Spending</p>
        </div>
        
        <div class="cards-container">
            <!-- Plastic Card -->
            <div class="card">
                <div class="card-header">
                    <h3>Plastic Card</h3>
                </div>
                <div class="card-image">
                    <img src="https://www.bananacrystal.com/wp-content/uploads/2025/05/SM-Plastic-Card-1024x576.jpg" alt="Plastic Card">
                </div>
                <div class="card-content">
                    <div class="fee-item">
                        <i class="fas fa-file-invoice-dollar icon-size"></i>
                        <div class="fee-item-content">
                            <span class="fee-label">Application Fee:</span>
                            <span class="fee-value">$400</span>
                        </div>
                    </div>
                    <div class="fee-item">
                        <i class="fas fa-upload icon-size"></i>
                        <div class="fee-item-content">
                            <span class="fee-label">Loading Fee:</span>
                            <span class="fee-value">3.125%</span>
                        </div>
                    </div>
                    <div class="fee-item">
                        <i class="fas fa-exchange-alt icon-size"></i>
                        <div class="fee-item-content">
                            <span class="fee-label">Conversion Fee:</span>
                            <span class="fee-value">3.125%</span>
                        </div>
                    </div>
                    <div class="fee-item">
                        <i class="fas fa-money-bill-wave icon-size"></i>
                        <div class="fee-item-content">
                            <span class="fee-label">ATM Withdrawal Fee:</span>
                            <span class="fee-value">0.75%</span>
                        </div>
                    </div>
                    <div class="fee-item">
                        <i class="fas fa-search-dollar icon-size"></i>
                        <div class="fee-item-content">
                            <span class="fee-label">ATM Check Balance Fee:</span>
                            <span class="fee-value">Possible charge by the bank ATM</span>
                        </div>
                    </div>
                    <div class="fee-item">
                        <i class="fas fa-shopping-cart icon-size"></i>
                        <div class="fee-item-content">
                            <span class="fee-label">POS Online Fee:</span>
                            <span class="fee-value">0.75%</span>
                        </div>
                    </div>
                    <div class="fee-item">
                        <i class="fas fa-chart-line icon-size"></i>
                        <div class="fee-item-content">
                            <span class="fee-label">Monthly Cap:</span>
                            <span class="fee-value">$20,000</span>
                        </div>
                    </div>
                </div>
                <div class="card-footer">
                    <a href="https://payment.bananacrystal.com/pay?store_id=80db794c-b80b-40e2-a44e-b2aa40c6dc1f&amount=400.0&currency=USD&description=Black%20Plastic%20USD%20Debit%20Card%20&product_name=Plastic%20Card&redirect_url=https%3A%2F%2Fwww.bananacrystal.com%2Fplastic-card-success%2F&usd_amount=400.0&gohighlevel_enabled=true&gohighlevel_api_key=U2FsdGVkX1%2FWlC3MF2vvHPB7KghykAKrAEqZsN67J0CvBmDleK%2BgK6rrodev3o2diBDJB9M33G%2F56aMcKpOTaGOtMLpMGFlBxJBrzM3O1su9k1gMLH1IVdM6JforzMNnhf9hnh6jmS2xOKH3UHOp8VqzFTyh%2FwP6OR8bNHzEo76FIXCO%2BO4fEA4Hs46bxIs%2FRqfht6174TmNUZdkfJfWFYMiwq%2FvDQl9b5QRIrbeuI5L%2Fjxz2FfOGW59smjepu6V7dvJ5L1IJTFqRfZr3aKoZAA0hRYxALycvLIigNEQWCSXJr9%2F0lq01z2ZJ2iPw7R2&gohighlevel_tags=not_paid%2Cpaid%2Cplastic-card%2C20000-monthly-cap" target="_blank" class="select-button card-selection-btn" data-card-name="Plastic Card" data-card-value="400.0">Select This Card</a>
                </div>
            </div>
            
            <!-- Metal Black Card (Recommended) -->
            <div class="card card-recommended">
                <div class="recommended-badge">MOST POPULAR</div>
                <div class="card-header">
                    <h3>Metal Black</h3>
                </div>
                <div class="card-image">
                    <img src="https://www.bananacrystal.com/wp-content/uploads/2025/05/SM-Metal-Black-1024x576.jpg" alt="Metal Black Card">
                </div>
                <div class="card-content">
                    <div class="fee-item">
                        <i class="fas fa-file-invoice-dollar icon-size"></i>
                        <div class="fee-item-content">
                            <span class="fee-label">Application Fee:</span>
                            <span class="fee-value">$620</span>
                        </div>
                    </div>
                    <div class="fee-item">
                        <i class="fas fa-upload icon-size"></i>
                        <div class="fee-item-content">
                            <span class="fee-label">Loading Fee:</span>
                            <span class="fee-value">2.875%</span>
                        </div>
                    </div>
                    <div class="fee-item">
                        <i class="fas fa-exchange-alt icon-size"></i>
                        <div class="fee-item-content">
                            <span class="fee-label">Conversion Fee:</span>
                            <span class="fee-value">2.875%</span>
                        </div>
                    </div>
                    <div class="fee-item">
                        <i class="fas fa-money-bill-wave icon-size"></i>
                        <div class="fee-item-content">
                            <span class="fee-label">ATM Withdrawal Fee:</span>
                            <span class="fee-value">0.75%</span>
                        </div>
                    </div>
                    <div class="fee-item">
                        <i class="fas fa-search-dollar icon-size"></i>
                        <div class="fee-item-content">
                            <span class="fee-label">ATM Check Balance Fee:</span>
                            <span class="fee-value">Possible charge by the bank ATM</span>
                        </div>
                    </div>
                    <div class="fee-item">
                        <i class="fas fa-shopping-cart icon-size"></i>
                        <div class="fee-item-content">
                            <span class="fee-label">POS Online Fee:</span>
                            <span class="fee-value">0.75%</span>
                        </div>
                    </div>
                    <div class="fee-item">
                        <i class="fas fa-chart-line icon-size"></i>
                        <div class="fee-item-content">
                            <span class="fee-label">Monthly Cap:</span>
                            <span class="fee-value">$30,000</span>
                        </div>
                    </div>
                </div>
                <div class="card-footer">
                    <a href="https://payment.bananacrystal.com/pay?store_id=80db794c-b80b-40e2-a44e-b2aa40c6dc1f&amount=620.0&currency=USD&description=Metal%20Black%20USD%20Debit%20Card%20&product_name=Metal%20Black%20Card&redirect_url=https%3A%2F%2Fwww.bananacrystal.com%2Fmetal-black-success%2F&usd_amount=620.0&gohighlevel_enabled=true&gohighlevel_api_key=U2FsdGVkX1%2FNjol%2FsO3frH9mPe5RRw7RtNc02bUl4mxXu58XcfjNPpLR4Gmew%2B099K3D9atMFN3xZsLyNIOZPLv4WVjVGcuICCBO2%2FE%2FsmoEzPFapR4hqLmSggey%2FQdlIQsKgAepK6i3NztRxid%2FmAo8fM%2BQWkdR12kM3Abj3uy1yy3KZlgv9jetyKksxRtkz3RLZAsI6YKbsrPU5nK5zkF%2FBZ3Hy6CMxLkej8B%2F89g4uLqdIhgNuUryNjeA2Eh%2Be4T1vtyEiQ77rC8wHJonOMYmLUcI%2Ft%2FQ7VpKYL1bX0x1PmkC0vOEvLk5B6NveRT0&gohighlevel_tags=not_paid%2Cpaid%2Cmetal-black-card%2Cmonthly-cap-30000" target="_blank" class="select-button card-selection-btn" data-card-name="Metal Black Card" data-card-value="620.0">Select This Card</a>
                </div>
            </div>
            
            <!-- Metal Silver Card -->
            <div class="card">
                <div class="card-header">
                    <h3>Metal Silver</h3>
                </div>
                <div class="card-image">
                    <img src="https://www.bananacrystal.com/wp-content/uploads/2025/05/Silver-Metal-Card.jpg" alt="Metal Silver Card">
                </div>
                <div class="card-content">
                    <div class="fee-item">
                        <i class="fas fa-file-invoice-dollar icon-size"></i>
                        <div class="fee-item-content">
                            <span class="fee-label">Application Fee:</span>
                            <span class="fee-value">$770</span>
                        </div>
                    </div>
                    <div class="fee-item">
                        <i class="fas fa-upload icon-size"></i>
                        <div class="fee-item-content">
                            <span class="fee-label">Loading Fee:</span>
                            <span class="fee-value">2.625%</span>
                        </div>
                    </div>
                    <div class="fee-item">
                        <i class="fas fa-exchange-alt icon-size"></i>
                        <div class="fee-item-content">
                            <span class="fee-label">Conversion Fee:</span>
                            <span class="fee-value">2.625%</span>
                        </div>
                    </div>
                    <div class="fee-item">
                        <i class="fas fa-money-bill-wave icon-size"></i>
                        <div class="fee-item-content">
                            <span class="fee-label">ATM Withdrawal Fee:</span>
                            <span class="fee-value">0.75%</span>
                        </div>
                    </div>
                    <div class="fee-item">
                        <i class="fas fa-search-dollar icon-size"></i>
                        <div class="fee-item-content">
                            <span class="fee-label">ATM Check Balance Fee:</span>
                            <span class="fee-value">Possible charge by the bank ATM</span>
                        </div>
                    </div>
                    <div class="fee-item">
                        <i class="fas fa-shopping-cart icon-size"></i>
                        <div class="fee-item-content">
                            <span class="fee-label">POS Online Fee:</span>
                            <span class="fee-value">0.75%</span>
                        </div>
                    </div>
                    <div class="fee-item">
                        <i class="fas fa-chart-line icon-size"></i>
                        <div class="fee-item-content">
                            <span class="fee-label">Monthly Cap:</span>
                            <span class="fee-value">$50,000</span>
                        </div>
                    </div>
                </div>
                <div class="card-footer">
                    <a href="https://payment.bananacrystal.com/pay?store_id=80db794c-b80b-40e2-a44e-b2aa40c6dc1f&amount=770.0&currency=USD&description=BananaCrystal%20Metal%20Silver%20Card%20USD%20Debit%20Card&product_name=Metal%20Silver%20Card&redirect_url=https%3A%2F%2Fwww.bananacrystal.com%2Fmetal-silver-success%2F&usd_amount=770.0&gohighlevel_enabled=true&gohighlevel_api_key=U2FsdGVkX192%2F6uk9Kj2jaUubjJaWrjtcJ9arBGE7EusbIEHQ3uMUtxy7x%2F5SmUnHNCTHPx1GppupeihY9N%2B2On2BnaXEA8d1nqa1AXmuh4ebUQyZ6K2KZPlZy49o9QNHWha%2FmM9CoougYLzoava4OKbqmuNzmJgtRtLoSr3EbqQOgFpjtCxto1%2BeN1xjVghNLrqJJ9Z8kpgH%2B1tOUhPDGOMUi%2FRg1d5Tv28yQfPqSaBw%2Bok4cR6s8yEOL%2Blswo35bDRsf%2FDJFGDUyGToRFP66NHUAbqK8GBRCgSyQ%2FgkncIJmWxTK2CLrLiku0kiglb&gohighlevel_tags=not_paid%2Cpaid%2Cmetal-silver-card%2Cmonthly-cap-50000" target="_blank" class="select-button card-selection-btn" data-card-name="Metal Silver Card" data-card-value="770.0">Select This Card</a>
                </div>
            </div>
            
            <!-- Metal Gold Card -->
            <div class="card">
                <div class="card-header">
                    <h3>Metal Gold</h3>
                </div>
                <div class="card-image">
                    <img src="https://www.bananacrystal.com/wp-content/uploads/2025/05/Gold-Metal-Card.jpg" alt="Metal Gold Card">
                </div>
                <div class="card-content">
                    <div class="fee-item">
                        <i class="fas fa-file-invoice-dollar icon-size"></i>
                        <div class="fee-item-content">
                            <span class="fee-label">Application Fee:</span>
                            <span class="fee-value">$1,120</span>
                        </div>
                    </div>
                    <div class="fee-item">
                        <i class="fas fa-upload icon-size"></i>
                        <div class="fee-item-content">
                            <span class="fee-label">Loading Fee:</span>
                            <span class="fee-value">2.125%</span>
                        </div>
                    </div>
                    <div class="fee-item">
                        <i class="fas fa-exchange-alt icon-size"></i>
                        <div class="fee-item-content">
                            <span class="fee-label">Conversion Fee:</span>
                            <span class="fee-value">2.125%</span>
                        </div>
                    </div>
                    <div class="fee-item">
                        <i class="fas fa-money-bill-wave icon-size"></i>
                        <div class="fee-item-content">
                            <span class="fee-label">ATM Withdrawal Fee:</span>
                            <span class="fee-value">0.75%</span>
                        </div>
                    </div>
                    <div class="fee-item">
                        <i class="fas fa-search-dollar icon-size"></i>
                        <div class="fee-item-content">
                            <span class="fee-label">ATM Check Balance Fee:</span>
                            <span class="fee-value">Possible charge by the bank ATM</span>
                        </div>
                    </div>
                    <div class="fee-item">
                        <i class="fas fa-shopping-cart icon-size"></i>
                        <div class="fee-item-content">
                            <span class="fee-label">POS Online Fee:</span>
                            <span class="fee-value">0.75%</span>
                        </div>
                    </div>
                    <div class="fee-item">
                        <i class="fas fa-chart-line icon-size"></i>
                        <div class="fee-item-content">
                            <span class="fee-label">Monthly Cap:</span>
                            <span class="fee-value unlimited-cap">Unlimited</span>
                        </div>
                    </div>
                </div>
                <div class="card-footer">
                    <a href="https://payment.bananacrystal.com/pay?store_id=80db794c-b80b-40e2-a44e-b2aa40c6dc1f&amount=1120.0&currency=USD&description=BananaCrystal%20Metal%20Gold%20USD%20Debit%20Card%20&product_name=Metal%20Gold%20Card&redirect_url=https%3A%2F%2Fwww.bananacrystal.com%2Fmetal-gold-success%2F%20&usd_amount=1120.0&gohighlevel_enabled=true&gohighlevel_api_key=U2FsdGVkX18llmBktUWxlr8OKnV8953Feu5VaxVQ0iq8Wx9rQ%2BBHhHUnMp31fCAAIXWeoctkg6qhKwoAht4iHFvfScuSIi8FZaaz5QrZM2Ov6ZBoLhEg%2FPCtAGFJ8trw6UaVzsHeenFcTxD24UBBUyKzKsaU3hZKia6Pk8DV3J%2F2AnhNaygG%2FzttKjpipyjxJ%2BDrLGnfOKibM3VrIXQRgN3o%2FEB14YUxk95D%2Bov2MFCFR%2Bo37DPddT%2BiJmQIID%2BhS117mTVqzo0aSuWMF0Y1gLBXpiAUEMsUJciGJqPT%2BMpvcZO908yj2NTvXWZzGj%2Fp&gohighlevel_tags=not_paid%2Cpaid%2Cmetal-gold-card%2Cmonthly-cap-unlimited" target="_blank" class="select-button card-selection-btn" data-card-name="Metal Gold Card" data-card-value="1120.0">Select This Card</a>
                </div>
            </div>
        </div>
    </div>

    <script>
        // Twitter conversion tracking for card selection
        document.addEventListener('DOMContentLoaded', function() {
            const cardButtons = document.querySelectorAll('.card-selection-btn');
            
            cardButtons.forEach(button => {
                button.addEventListener('click', function(e) {
                    // Get card details from data attributes
                    const cardName = this.getAttribute('data-card-name');
                    const cardValue = this.getAttribute('data-card-value');
                    
                    // Fire Twitter conversion event
                    try {
                        twq('event', 'tw-q5wia-q5wie', {
                            value: parseFloat(cardValue),
                            currency: 'USD',
                            contents: [{
                                content_name: cardName,
                               
                                content_id: cardName.toLowerCase().replace(/\s+/g, '-'),
                                content_type: 'product',
                                value: parseFloat(cardValue),
                                currency: 'USD'
                            }]
                        });
                        
                        // Optional: Log for debugging (remove in production)
                        console.log('Twitter conversion event fired for:', cardName, 'Value:', cardValue);
                    } catch (error) {
                        console.error('Twitter conversion tracking error:', error);
                    }
                });
            });
        });
    </script>
</body>
</html>