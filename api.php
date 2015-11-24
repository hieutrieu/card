<?php

class Result {
    public function getResult($resultId)
    {
        $url = 'https://api.github.com/gists/'. $resultId;

        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_USERAGENT, 'Flower-Color-Test-App');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $response = curl_exec($ch);
        curl_close($ch);

        $json = @json_decode($response);

        if (!isset($json->files->result->content) || !$json->files->result->content || $json->files->result->content == 'null') {
            die(json_encode(array(
                'success' => false,
                'data' => 'Cannot find the gist content'
            )));
        }

        $data = $json->files->result->content;

        die(json_encode(array(
            'success' => true,
            'data' => $data
        )));
    }

    public function saveResult($resultData)
    {
        # Creating the array
        $data = array(
            'description' => 'The result of Flower Color Test App',
            'public' => true,
            'files' => array(
                'result' => array('content' => $resultData),
            ),
        );

        $data_string = json_encode($data);

        # Sending the data using cURL
        $url = 'https://api.github.com/gists';
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data_string);
        curl_setopt($ch, CURLOPT_USERAGENT, 'Flower-Color-Test-App');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $response = curl_exec($ch);
        curl_close($ch);

        # Parsing the response
        $decoded = json_decode($response, TRUE);
        $gistlink = $decoded['html_url'];

        die(json_encode(array(
            'success' => true,
            'hash'    => str_replace('https://gist.github.com/', '', $gistlink)
        )));
    }
}

$result = new Result;

if (isset($_GET['TxtFunc'])) {
    switch ($_GET['TxtFunc']) {
        case 'get':
            $resultId = (isset($_GET['TxtID'])) ? $_GET['TxtID'] : null;

            if ($resultId === NULL) {
                die(json_decode(array(
                    'result' => false,
                    'message' => 'Please provide result id.'
                )));
            }

            $result->getResult($resultId);
        break;

        case 'save':
            $resultData = (isset($_GET['TxtData'])) ? $_GET['TxtData'] : null;

            if ($resultData === NULL) {
                die(json_decode(array(
                    'result' => false,
                    'message' => 'Please provide result data.'
                )));
            }

            $result->saveResult($resultData);
        break;
    }
}
?>