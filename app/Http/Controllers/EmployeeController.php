<?php

namespace App\Http\Controllers;

use App\Http\Controllers\AchPayment;
use Auth;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Dwolla;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Hash;

use DwollaSwagger;

class EmployeeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
        $breadcrumbs = [
            ['link' => "/", 'name' => "Home"], ['link' => "javascript:void(0)", 'name' => "Employee"], ['name' => "Dashboard"],
        ];
        //Pageheader set true for breadcrumbsqq
        $pageConfigs = ['pageHeader' => true];
        $employee_details = User::findOrFail(Auth::user()->id);
        $ach = new AchPayment;
        $achTransfers = $ach->getCustomerTransfers(Auth::user()->id);
        return view('pages.employees.dashboard', [
            'pageConfigs' => $pageConfigs,
            'employee_details' => $employee_details,
            'achTransfers' => $achTransfers->_embedded->transfers ?? []], ['breadcrumbs' => $breadcrumbs]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param int $id
     * @return Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param int $id
     * @return Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param int $id
     * @return Response
     */
    public function update(Request $request, $id)
    {
        if ($request['from'] == 'profile_update') {
            $this->validate($request, [
                'firstname' => 'required',
                'lastname' => 'required',
                'password_confirm' => 'same:password'
            ]);

            $data = [
                'firstname' => $request['firstname'],
                'lastname' => $request['lastname'],
            ];
            if (@$request['password']) {
                $data['password'] = Hash::make($request->password);
            }
        } elseif ($request['from'] == 'bank_update') {
            $ach = new AchPayment;

            // $data = $this->validate($request,[
            //     'bank_account'=> 'required',
            //     'routing'=> 'required',
            //     'bank_nickname' => 'required'
            // ]);

            // $achrequest = new \Illuminate\Http\Request();

            // $achrequest->request->add([
            //                         // 'bank_account' => $data['bank_account'],
            //                         // 'routing' => $data['routing'],
            //                         // 'bank_nickname' => $data['bank_nickname']
            //                     ]);

            $output = $ach->verifyAchCustomerBank();
            // dd($output);

            // if($request->ajax()){
            //     return response()->json(['msg' => 'success']);
            // }
            // return response()->json($ach->verifyAchCustomerBank($achrequest));
            return response()->json($output);

        } elseif ($request['from'] == 'bank_funding_source') {
            if ($request['fundingSource']) {

                $fundingSource = explode('/', $request['fundingSource']);
                $fundingSourceId = end($fundingSource);
                $ach = new AchPayment;
                $ach->generateAchAPIToken();
                $dwolla_api_env_url = config('services.dwolla.env_url');
                $apiClient = new DwollaSwagger\ApiClient($dwolla_api_env_url);
                $accountsApi = new DwollaSwagger\FundingsourcesApi($apiClient);
                $account = $accountsApi->id($fundingSourceId);
                $is_verified = $account->status == 'verified';
                $dwolla = Dwolla::where([
                    'user_id' => Auth::user()->id,
                ])->first()->update([
                    'funding_source' => $request['fundingSource'],
                    'funding_source_id' => $account->id, 'is_verified' => $is_verified
                ]);
                User::where('id', Auth::user()->id)->first()->update(['is_active' => 1]);
            }

            return response()->json(['msg' => 'success']);
        } else {
            $this->validate($request, [
                'address1' => 'required',
                'city' => 'required',
                'zip' => 'required',
                'state' => 'required',
            ]);

            $data = [
                'address1' => $request['address1'],
                'address2' => $request['address2'] ?? null,
                'zip' => $request['zip'],
                'state' => $request['state'],
                'city' => $request['city'],
            ];
        }

        $user = User::findOrFail($id);

        $user->update($data);

        $ach = new AchPayment;
        $achrequest = new Request();
        $achrequest->request->add([
            'achFirstName' => $user['firstname'],
            'achLastName' => $user['lastname'],
            'achEmail' => $user['email']
        ]);

        $achout = $ach->processAchCustomer($achrequest);

        if ($request->ajax()) {
            return response()->json(['msg' => 'success', 'achout' => $achout]);
        }

        return redirect()->back();
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param int $id
     * @return Response
     */
    public function destroy($id)
    {
        //
    }

    public function UpdateFundingSource(Request $request, User $employee)
    {
        $ach = new AchPayment;
        $ach->generateAchAPIToken();
        $dwolla_api_env_url = config('services.dwolla.env_url');
        $apiClient = new DwollaSwagger\ApiClient($dwolla_api_env_url);
        $customersApi = new DwollaSwagger\CustomersApi($apiClient);
        $fsToken = $customersApi->getCustomerIavToken("{$dwolla_api_env_url}/customers/{$employee->dwolla->ach_customer_id}");
        return view('pages.employees.funding_source', ['token' => $fsToken->token]);
    }
}
