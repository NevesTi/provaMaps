export default class PlaceEntity{
    id: string;
    description:string;
    coords: {latitude: number, longitude: number};    
    imagePath:string;
    photoDate:string;
    title:string;
    author:string;
}