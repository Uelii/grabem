<?php

namespace App\Http\Controllers;

use App\Renter;
use App\Object;
use App\Building;
use Illuminate\Http\Request;
use Session;
use DB;

class RenterController extends Controller
{
    /*
     * Fill in Street, Street number, zip code and city into renter creation form
     */
    public function fillInBuildingData($id) {
        $building = Building::findOrFail(Object::findOrFail($id)->building_id);
        $building_street = $building->street;
        $building_street_number = $building->street_number;
        $building_zip_code = $building->zip_code;
        $building_city = $building->city;

        return response([
            'building_street' => $building_street,
            'building_street_number' => $building_street_number,
            'building_zip_code' => $building_zip_code,
            'building_city' => $building_city
        ]);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $renter = Renter::all();
        $objects = Object::all();

        return view('renter.index', compact('renter', 'objects'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $objects = Object::all();
        $buildings = Building::all();

        return view('renter.create', compact('objects', 'buildings'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        /*If object_id= null, dann keine Beziehung in der Hilfstabelle object_renter erstellen*/

        //Validate Input
        $this->validate($request, [
            'title' => 'required|in:Mr.,Ms.',
            'first_name' => 'required|max:255|regex:/^[(a-zäöüéèàA-Z\ÄÖÜs\s\-)]+$/u',
            'last_name' => 'required|max:255|regex:/^[(a-zäöüéèàA-Z\ÄÖÜs\s\-)]+$/u',
            'email' => 'required|email|max:255|unique:renter',
            'phone_landline' => 'max:255|regex:/(0)([0-9]{2})\s([0-9]{3})\s([0-9]{2})\s([0-9]{2})/', /*Format 0xx xxx xx xx*/
            'phone_mobile_phone' => 'max:255|regex:/(0)([0-9]{2})\s([0-9]{3})\s([0-9]{2})\s([0-9]{2})/', /*Format 0xx xxx xx xx*/
            'street' => 'required|max:255|regex:/^[(a-zäöüéèàA-Z\ÄÖÜs\s\-)]+$/u',
            'street_number' => 'required|numeric|min:0|digits_between:1,3',
            'zip_code' => 'required|min:0|digits:4',
            'city' => 'required|max:255|regex:/^[(a-zäöüéèàA-Z\ÄÖÜs\s\-)]+$/u',
            'is_main_domicile' => 'boolean',
            'beginning_of_contract' => 'required|date',
            'end_of_contract' => 'date'
        ]);

        $input = $request->all();

        //Check if a contract end date has been entered
        if( empty($request->input('end_of_contract'))) {
            $input['end_of_contract'] = null;
        }



        //Create record in database
        //Create relationship in table 'object_renter' if an object has been selected
        if( !empty($request->input('object_id'))) {
            Renter::create($input);
            $object = Object::find($request->input('object_id'));
            $renter_id = DB::table('renter')->orderBy('id', 'desc')->first()->id;
            $object->renter()->attach($renter_id);

        } else {
            dd($request->input('object_id'));
            Renter::create($input);
        }

        //Return whole array and display Success-Message
        $renter = Renter::all();
        $objects = Object::all();
        Session::flash('success_message', 'Renter successfully added!');

        return view('renter.index', compact('renter', 'objects'));
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}