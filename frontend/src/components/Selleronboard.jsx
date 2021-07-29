import React from 'react';
import Button from '@material-ui/core/Button'

function Selleronboard(props) {
    return (
        <div dir="ltr" style={{ textAlign: "left", trbidi: "on" }}>
            <script>
                {(function (d, s, id) {
                    var js, ref = d.getElementsByTagName(s)[0];
                    if (!d.getElementById(id)) {
                        js = d.createElement(s);
                        js.id = id;
                        js.async = true;
                        js.src = "https://www.paypal.com/webapps/merchantboarding/js/lib/lightbox/partner.js";
                        ref.parentNode.insertBefore(js, ref);
                    }
                }(document, "script", "paypal-js"))};
            </script>
            <Button></Button>
            <a data-paypal-button="true" href={`${props.action_link}&displayMode=minibrowser`} target="PPFrame">按此登記paypal</a>
        </div>
    )
}

export default Selleronboard