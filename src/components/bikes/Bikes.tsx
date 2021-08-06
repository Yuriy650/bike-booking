import React, {useEffect, useState} from 'react';
import './bikes.scss'
import "@fontsource/saira-stencil-one";
import "@fontsource/saira";
import BikeItem from "../bike-item/BikeItem";
import {Bike} from "../../interfaces";
import * as localForage from "localforage";

const Bikes = () => {
    let defaultBike: Bike = {
        id: '',
        name: '',
        type: '',
        color: '',
        wheel: 0,
        price: 0,
        description: '',
        status: ''
    }
    const [newBike, setNewBike] = useState<Bike>(defaultBike);
    const [bikesList, setBikesList] = useState<Bike[]>([]);
    const [keys, setKeys] = useState<string[]>([]);
    const [availables, setAvailables] = useState<number>(0)
    const {id, name, type, color, wheel, price, description} = newBike;
    const onChange = (e: any) => {
        setNewBike((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value
        }))
    }
    const changeBikesList = (bikes: Bike[]) => {
        setBikesList(bikes)
    }
    const onSubmitHandler = (e: any) => {
        e.preventDefault();
        setNewBike(newBike);
        localForage.setItem(`${newBike.id}`, newBike)
            .then((value) => {
                setBikesList(prevState => [...prevState, value])
                console.log(value);
            })
            .catch((error) => {
                console.log(error)
            });
        setNewBike(defaultBike);
    }
    const onClickClear = () => {
        setNewBike(defaultBike);
    }
    useEffect(() => {
        localForage.keys()
            .then((keys) => {
                setKeys(keys);
                console.log(keys)
            })
            .catch((err) => {
                console.log(err);
            })
    }, [])
    useEffect(() => {
        // eslint-disable-next-line
        keys.map((item) => {
            localForage.getItem(item)
                .then((value: any) => {
                    setBikesList(prevState => [...prevState, value])
                })
                .catch((err) => {
                    console.log(err);
                });
        })
    }, [keys])
    const averageCost = () => {
        let result = bikesList.reduce((sum, current) => sum + +current.price, 0);
        let average = result / bikesList.length;
        let averageCost = Math.floor(average);
        if (averageCost) {
            return averageCost
        } else return 0
    }
    const changeStatus = (bikes: Bike[]) => {
        setBikesList(bikes);
        return availableCount()
    }
    const availableCount = () => {
        let available = 0
        // eslint-disable-next-line
        bikesList.map((item) => {
            if (item.status !== '' && item.status === 'available') {
                available++;
            }
        })
        return available
    }
   const changeCountAvail = (availables: number) => {
        setAvailables(availables)
        console.log(availables)
    }
    const bookedCount = () => {
        let busy = 0
        bikesList.forEach((item) => {
            if (item.status !== '' && item.status === 'busy') {
                busy++;
            }
        })
        return busy
    }
    // @ts-ignore
    return (
        <div className="bikes-container">
            <div className="bikes-container__body">
                <h1 className="bikes-container__header">ADMIN.BIKE-BOOKING.COM</h1>
                <div className="bikes-container__content">
                    <div className="bikes-list-container">
                        {bikesList.map((item: Bike) => <BikeItem
                            changeBikesList={changeBikesList}
                            bikesList={bikesList}
                            key={item.id}
                            keys={keys}
                            changeCountAvail={changeCountAvail}
                            changeStatus={changeStatus}
                            item={item}/>)}
                        <div className='text'>Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                            Amet aut consectetur et ipsa ipsam labore quae quibusdam reprehenderit rerum, voluptatem.
                        </div>
                    </div>
                    <div className="add-bike">
                        <div className="form-container">
                            <form onSubmit={onSubmitHandler}>
                                <div className="form-fields">
                                    <div className="form-fields__block">
                                        <input
                                            type="text"
                                            onChange={onChange}
                                            value={name}
                                            name='name'
                                            minLength={5}
                                            required
                                            placeholder="Name"/>
                                        <input
                                            type="text"
                                            onChange={onChange}
                                            minLength={5}
                                            value={type}
                                            name='type'
                                            required
                                            placeholder="Type"/>
                                        <input
                                            type="text"
                                            onChange={onChange}
                                            minLength={5}
                                            value={color}
                                            name='color'
                                            required
                                            placeholder="Color"/>
                                        <input
                                            type="number"
                                            onChange={onChange}
                                            value={wheel}
                                            name='wheel'
                                            required
                                            placeholder="Wheel size"/>
                                    </div>
                                    <div>
                                        <input
                                            type="number"
                                            onChange={onChange}
                                            value={price}
                                            name='price'
                                            required
                                            placeholder="Price"/>
                                        <input
                                            type="text"
                                            onChange={onChange}
                                            minLength={5}
                                            value={id}
                                            name='id'
                                            required
                                            placeholder="ID"/>
                                    </div>
                                    <div className="form-fields__block">
                                        <textarea
                                            onChange={onChange}
                                            value={description}
                                            minLength={5}
                                            name='description'
                                            required>Description</textarea>
                                    </div>
                                    <div className="form-fields__buttons">
                                        <button type="submit" className="btn-save">Save</button>
                                        <button type="button" className="btn-clear" onClick={onClickClear}>Clear
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="statistic-container">
                            <ul>
                                <span className="statistic-container__title">Statistics</span>
                                <li>Total Bikes: <span>{bikesList.length}</span></li>
                                <li>Available Bikes: <span>{availables}</span></li>
                                <li>Booked Bikes: <span>{bookedCount()}</span></li>
                                <li>Average bike cost:<span>{averageCost()}</span>UAH/hour</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="bikes-container__footer">
                    <span className="developer">Developer:</span> <span>FirstName LastName</span>
                </div>
            </div>
        </div>
    )
}
export default Bikes;
