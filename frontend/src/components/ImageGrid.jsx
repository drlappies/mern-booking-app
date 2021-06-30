import React from 'react';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';

function ImageGrid(props) {
    return (
        <GridList cols={4}>
            <GridListTile cols={2} rows={2}>
                <img src={props.img0} alt="" />
            </GridListTile>
            <GridListTile cols={2} rows={2}>
                <GridList>
                    <GridListTile>
                        <img src={props.img1} alt="" />
                    </GridListTile>
                    <GridListTile>
                        <img src={props.img2} alt="" />
                    </GridListTile>
                    <GridListTile>
                        <img src={props.img3} alt="" />
                    </GridListTile>
                    <GridListTile>
                        <img src={props.img4} alt="" />
                    </GridListTile>
                </GridList>
            </GridListTile>
        </GridList >
    )
}

export default ImageGrid