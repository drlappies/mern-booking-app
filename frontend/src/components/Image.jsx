import React from 'react';

function Image(props) {
    return (
        <img alt={props.alt} src={props.src} width={props.width} height={props.height} />
    )
}

export default Image