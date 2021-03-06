<?php

namespace immogate\Http\Controllers;

use immogate\Object;
use immogate\Building;
use immogate\Renter;
use Illuminate\Http\Request;
use Session;
use DB;

class ObjectsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $objects = Object::all();
        $buildings = Building::all();
        $renter = Renter::all();

        return view('objects.index', compact('objects', 'buildings', 'renter'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $buildings = DB::table('buildings')->orderBy('name', 'asc')->get();

        return view('objects.create', compact('buildings'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        /*Validate Input*/
        $this->validate($request, [
            'building_id' => 'required',
            'name' => 'required|max:50|regex:/^[(0-9.,\\/_a-zäöüéèàA-Z\ÄÖÜs\s\-\')]+$/u',
            'description' => 'regex:/^[(0-9.,\\/_a-zäöüéèàA-Z\ÄÖÜs\s\-\')]+$/u',
            'living_space' => 'required|numeric|min:1',
            'number_of_rooms' => 'required|numeric|',
            'floor_room_number' => 'required|regex:/^[(0-9.,\\/_a-zäöüéèàA-Z\ÄÖÜs\s\-\')]+$/u',
            'rent' => 'required|numeric|min:0'
        ]);
        
        /*Create record in database*/
        $input = $request->all();
        Object::create($input);

        /*Get data and redirect to specific route with success-message*/
        $objects = Object::all();
        $buildings = Building::all();
        $renter = Renter::all();

        return redirect()->route('objects.index')->with(compact('objects', 'buildings', 'renter'))->with('success_message', 'Object successfully added!');
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        /*If the record has been found, access view*/
        $object = Object::findOrFail($id);

        return view('objects.show', compact('object'));
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        /*If the record has been found, access view*/
        $object = Object::findOrFail($id);

        /*Get all other buildings except the one which is going to be edited*/
        $buildings = Building::where('id', '!=', $object->building->id)->orderBy('name', 'asc')->get();

        return view('objects.edit', compact('object', 'buildings'));
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
        /*Validate Input*/
        $this->validate($request, [
            'building_id' => 'required',
            'name' => 'required|max:50|regex:/^[(0-9.,\\/_a-zäöüéèàA-Z\ÄÖÜs\s\-\')]+$/u',
            'description' => 'regex:/^[(0-9.,\\/_a-zäöüéèàA-Z\ÄÖÜs\s\-\')]+$/u',
            'living_space' => 'required|numeric|min:1',
            'number_of_rooms' => 'required|numeric|',
            'floor_room_number' => 'required|regex:/^[(0-9.,\\/_a-zA-Z\s\-\')]+$/u',
            'rent' => 'required|numeric|min:0'
        ]);

        /*Update record in database*/
        $input = $request->all();
        $object = Object::findOrFail($id);
        $object->fill($input)->save();

        return redirect()->back()->with('success_message', 'Object successfully updated!');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        /*Delete record in database*/
        $object = Object::findOrFail($id);
        $object->delete();

        return redirect()->back()->with('success_message', 'Object successfully deleted!');
    }
}
