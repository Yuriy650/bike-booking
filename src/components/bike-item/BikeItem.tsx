import React, {useState} from 'react';
import './bike-item.scss';
import {Bike} from "../../interfaces";
import localForage from 'localforage';

const BikeItem = (props: any) => {
//const [availables, setAvailables] = useState(0);
    const removeItem = (e: React.MouseEvent<HTMLButtonElement>) => {
        console.log(e.currentTarget.id);
        localForage.removeItem(e.currentTarget.id)
            .then(() => {
                console.log('Key is cleared!');
            }).catch((err) => {
            console.log(err);
        });
        const bikes = props.bikesList.filter((item: Bike) => item.id !== e.currentTarget.id);
        props.changeBikesList(bikes)
    }

   const getCountAvailable = () => {
        let avail = 0;
        props.bikesList.map((item:Bike)=>{
           if (item.status !== '' && item.status === 'available') {
               avail++;
               console.log(avail)
           }
       })
       props.changeCountAvail(avail)
    }
    const onChangeStatus = (e: any) => {
       e.preventDefault()
        // eslint-disable-next-line
       props.keys.map((item: string) => {
            localForage.getItem(item)
                .then((value: any) => {
                    if (item === e.target.id) {
                        value.status = e.target.value
                        console.log(value)
                        localForage.setItem(item, value)
                            .then(()=>getCountAvailable())
                    }
                })
                .catch((err) => {
                    console.log(err);
                });

        })
   }

    return (
        <div className="bike-container">
            <div className={`bike-container__body-${props.item.status}`}>
                <div className="bike-container__properties">
                    <ul>
                        <li><span className="name">{props.item.name} - </span><span
                            className="type">{props.item.type}({props.item.color})</span></li>
                        <li className="id">ID: {props.item.id}</li>
                        <li><span className="status">STATUS:</span>
                            <select id={props.item.id} required onChange={onChangeStatus}>
                                <option>Change Status:</option>
                                <option value='available'>Available</option>
                                <option value='unavailable'>Unavailable</option>
                                <option value='busy'>Busy</option>
                            </select>
                        </li>
                    </ul>
                </div>
                <div className="bike-container__value">
                    <button className="btn-delete" type="button" id={props.item.id}
                            onClick={(id) => removeItem(id)}>&times;</button>
                    <div className="price">{props.item.price} UAH/hr</div>
                </div>
            </div>
        </div>
    )
}

export default BikeItem;
